"""
Restore Cursor chats/context after moving myplyn from Desktop to D:\\myplyn.
Creates backups before modifying anything.
"""
import json
import shutil
import sqlite3
from datetime import datetime
from pathlib import Path

OLD_WS_ID = "7193d69d18c43f8be66b526f67d2199e"
NEW_WS_ID = "b5271bcb15332cbe8b8d214eb75da1b0"
OLD_PATH = r"c:\Users\OK COMPUTER\Desktop\myplyn"
NEW_PATH = r"d:\myplyn"
OLD_PATH_URI = "file:///c%3A/Users/OK%20COMPUTER/Desktop/myplyn"
NEW_PATH_URI = "file:///d%3A/myplyn"

OLD_PROJECT = Path(r"C:\Users\OK COMPUTER\.cursor\projects\c-Users-OK-COMPUTER-Desktop-myplyn")
NEW_PROJECT = Path(r"C:\Users\OK COMPUTER\.cursor\projects\d-myplyn")
OLD_WS_DB = Path(
    rf"C:\Users\OK COMPUTER\AppData\Roaming\Cursor\User\workspaceStorage\{OLD_WS_ID}\state.vscdb"
)
NEW_WS_DB = Path(
    rf"C:\Users\OK COMPUTER\AppData\Roaming\Cursor\User\workspaceStorage\{NEW_WS_ID}\state.vscdb"
)
GLOBAL_DB = Path(
    r"C:\Users\OK COMPUTER\AppData\Roaming\Cursor\User\globalStorage\state.vscdb"
)
CHECKPOINTS = Path(
    r"C:\Users\OK COMPUTER\AppData\Roaming\Cursor\User\globalStorage\anysphere.cursor-commits\checkpoints"
)

BACKUP_DIR = Path(r"D:\myplyn\.cursor-restore-backup") / datetime.now().strftime("%Y%m%d-%H%M%S")
BACKUP_DIR.mkdir(parents=True, exist_ok=True)

MYPlyn_COMPOSERS = {
    "ea4cb8e6-f293-48bb-8ee9-fc7e78d3d18a",
    "d7823527-df20-4e3b-9b47-0990432925f0",
}

WS_KEYS_TO_MERGE = [
    "aiService.generations",
    "aiService.prompts",
    "composer.composerData",
    "workbench.backgroundComposer.workspacePersistentData",
    "history.entries",
    "memento/workbench.editors.files.textFileEditor",
    "memento/workbench.parts.editor",
    "workbench.explorer.treeViewState",
    "browserAutomation.d08239.lastUrl",
]


def backup_file(path: Path) -> None:
    if path.exists():
        dest = BACKUP_DIR / path.name
        shutil.copy2(path, dest)
        print(f"  backed up {path.name}")


def replace_paths(text: str) -> str:
    return (
        text.replace(OLD_WS_ID, NEW_WS_ID)
        .replace(OLD_PATH, NEW_PATH)
        .replace(OLD_PATH.replace("\\", "\\\\"), NEW_PATH.replace("\\", "\\\\"))
        .replace(OLD_PATH_URI, NEW_PATH_URI)
        .replace(
            r"C:\Users\OK COMPUTER\Desktop\myplyn",
            r"D:\myplyn",
        )
        .replace(
            r"c:\Users\OK COMPUTER\Desktop\myplyn",
            r"d:\myplyn",
        )
    )


def new_workspace_uri() -> dict:
    return {
        "$mid": 1,
        "fsPath": NEW_PATH,
        "_sep": 1,
        "external": NEW_PATH_URI,
        "path": "/D:/myplyn",
        "scheme": "file",
    }


def merge_workspace_state() -> None:
    print("\n[2/5] Merging workspace state...")
    backup_file(NEW_WS_DB)

    old = sqlite3.connect(OLD_WS_DB)
    new = sqlite3.connect(NEW_WS_DB)
    old_cur = old.cursor()
    new_cur = new.cursor()

    for key in WS_KEYS_TO_MERGE:
        old_cur.execute("SELECT value FROM ItemTable WHERE key=?", (key,))
        row = old_cur.fetchone()
        if not row:
            continue
        value = replace_paths(row[0])
        new_cur.execute(
            "INSERT OR REPLACE INTO ItemTable (key, value) VALUES (?, ?)",
            (key, value),
        )
        print(f"  merged {key}")

    new.commit()
    old.close()
    new.close()


def relink_composer_headers() -> None:
    print("\n[3/5] Relinking chat history to D:\\myplyn...")
    backup_file(GLOBAL_DB)

    conn = sqlite3.connect(GLOBAL_DB)
    cur = conn.cursor()
    cur.execute(
        "SELECT value FROM ItemTable WHERE key='composer.composerHeaders'"
    )
    row = cur.fetchone()
    if not row:
        print("  composer.composerHeaders not found")
        conn.close()
        return

    data = json.loads(row[0])
    updated = 0
    for composer in data.get("allComposers", []):
        ws = composer.get("workspaceIdentifier", {})
        composer_id = composer.get("composerId", "")
        if ws.get("id") == OLD_WS_ID or composer_id in MYPlyn_COMPOSERS:
            composer["workspaceIdentifier"] = {
                "id": NEW_WS_ID,
                "uri": new_workspace_uri(),
            }
            if "trackedGitRepos" in composer and composer["trackedGitRepos"]:
                for repo in composer["trackedGitRepos"]:
                    if "repoPath" in repo:
                        repo["repoPath"] = NEW_PATH
            updated += 1
            name = composer.get("name") or composer_id[:8]
            print(f"  relinked: {name}")

    cur.execute(
        "UPDATE ItemTable SET value=? WHERE key='composer.composerHeaders'",
        (json.dumps(data),),
    )
    conn.commit()
    conn.close()
    print(f"  updated {updated} composer(s)")


def update_checkpoints() -> None:
    print("\n[4/5] Updating checkpoint metadata paths...")
    if not CHECKPOINTS.exists():
        print("  no checkpoints folder")
        return

    count = 0
    for meta in CHECKPOINTS.glob("*/metadata.json"):
        text = meta.read_text(encoding="utf-8")
        if OLD_WS_ID not in text and "Desktop\\myplyn" not in text and "Desktop/myplyn" not in text:
            continue
        backup_file(meta)
        meta.write_text(replace_paths(text), encoding="utf-8")
        count += 1

        diff_dir = meta.parent / "diffs"
        if diff_dir.exists():
            for diff in diff_dir.iterdir():
                content = diff.read_text(encoding="utf-8")
                if "Desktop" in content or OLD_WS_ID in content:
                    diff.write_text(replace_paths(content), encoding="utf-8")

    print(f"  updated {count} checkpoint(s)")


def copy_project_data() -> None:
    print("\n[1/5] Copying agent transcripts and assets...")
    transcripts_src = OLD_PROJECT / "agent-transcripts"
    transcripts_dst = NEW_PROJECT / "agent-transcripts"
    transcripts_dst.mkdir(parents=True, exist_ok=True)

    if transcripts_src.exists():
        for item in transcripts_src.iterdir():
            dest = transcripts_dst / item.name
            if dest.exists():
                print(f"  skip existing transcript: {item.name}")
                continue
            if item.is_dir():
                shutil.copytree(item, dest)
            else:
                shutil.copy2(item, dest)
            print(f"  copied transcript: {item.name}")

    assets_src = OLD_PROJECT / "assets"
    assets_dst = NEW_PROJECT / "assets"
    if assets_src.exists():
        if assets_dst.exists():
            for item in assets_src.iterdir():
                dest = assets_dst / item.name
                if not dest.exists():
                    if item.is_dir():
                        shutil.copytree(item, dest)
                    else:
                        shutil.copy2(item, dest)
                    print(f"  copied asset: {item.name}")
        else:
            shutil.copytree(assets_src, assets_dst)
            print("  copied assets folder")

    terminals_src = OLD_PROJECT / "terminals"
    terminals_dst = NEW_PROJECT / "terminals"
    if terminals_src.exists() and not terminals_dst.exists():
        shutil.copytree(terminals_src, terminals_dst)
        print("  copied terminals folder")


def patch_global_path_references() -> None:
    print("\n[5/5] Patching remaining global path references...")
    backup_file(GLOBAL_DB)
    conn = sqlite3.connect(GLOBAL_DB)
    cur = conn.cursor()
    cur.execute("SELECT key, value FROM ItemTable")
    patched = 0
    for key, value in cur.fetchall():
        if OLD_WS_ID in value or "Desktop\\myplyn" in value or "Desktop/myplyn" in value:
            if key == "composer.composerHeaders":
                continue  # already handled
            new_value = replace_paths(value)
            if new_value != value:
                cur.execute(
                    "UPDATE ItemTable SET value=? WHERE key=?",
                    (new_value, key),
                )
                patched += 1
                print(f"  patched {key}")
    conn.commit()
    conn.close()
    print(f"  patched {patched} additional key(s)")


def main() -> None:
    print(f"Cursor restore backup dir: {BACKUP_DIR}")
    print(f"Old workspace: {OLD_PATH} ({OLD_WS_ID})")
    print(f"New workspace: {NEW_PATH} ({NEW_WS_ID})")

    copy_project_data()
    merge_workspace_state()
    relink_composer_headers()
    update_checkpoints()
    patch_global_path_references()

    print("\nDone! Reload Cursor (close and reopen D:\\myplyn) to see restored chats.")
    print(f"Backups saved to: {BACKUP_DIR}")


if __name__ == "__main__":
    main()
