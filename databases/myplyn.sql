-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 18, 2026 at 02:18 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myplyn`
--

-- --------------------------------------------------------

--
-- Table structure for table `advertiser_profiles`
--

CREATE TABLE `advertiser_profiles` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `company_name` varchar(191) NOT NULL,
  `logo` varchar(191) DEFAULT NULL,
  `website` varchar(191) DEFAULT NULL,
  `industry` varchar(191) DEFAULT NULL,
  `country` varchar(191) DEFAULT NULL,
  `city` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `stripe_customer_id` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `social_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`social_links`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `advertiser_profiles`
--

INSERT INTO `advertiser_profiles` (`id`, `user_id`, `company_name`, `logo`, `website`, `industry`, `country`, `city`, `description`, `stripe_customer_id`, `created_at`, `updated_at`, `social_links`) VALUES
('15b53100-709b-40b6-a78b-cbcf62b767b4', '81811214-9840-467e-84a9-9e0d696f7d1c', 'Glow Beauty Co', NULL, 'https://glowbeauty.example.com', 'Beauty', 'United States', 'New York', 'Premium skincare and beauty products.', NULL, '2026-06-27 00:52:56.079', '2026-06-27 00:52:56.079', NULL),
('f34f7840-3d71-4825-886c-1cdc9af61a37', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'TechNova', NULL, NULL, 'Technology', 'United Kingdom', 'London', NULL, NULL, '2026-06-27 00:52:56.091', '2026-06-27 00:52:56.091', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` varchar(191) NOT NULL,
  `actor_id` varchar(191) NOT NULL,
  `action` varchar(191) NOT NULL,
  `entity_type` varchar(191) NOT NULL,
  `entity_id` varchar(191) NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `actor_id`, `action`, `entity_type`, `entity_id`, `metadata`, `created_at`) VALUES
('3236fdb1-1355-4194-b96f-bd1a32849935', '0567c23d-5594-4f99-bcff-e80a3d48bc46', 'PAGE_VERIFY', 'CREATOR_PAGE', '23284aef-0256-4dba-8c4e-f844ccffb70c', '{\"status\":\"VERIFIED\",\"niche\":\"Beauty\",\"location\":\"Washington, DC, US\"}', '2026-07-13 04:22:28.044'),
('ed58c78f-f533-4854-b029-33d51f7bbda5', '0567c23d-5594-4f99-bcff-e80a3d48bc46', 'PAGE_VERIFY', 'CREATOR_PAGE', '23284aef-0256-4dba-8c4e-f844ccffb70c', '{\"status\":\"VERIFIED\",\"niche\":\"Beauty\",\"location\":\"New york, USA\"}', '2026-07-13 04:07:50.187');

-- --------------------------------------------------------

--
-- Table structure for table `campaigns`
--

CREATE TABLE `campaigns` (
  `id` varchar(191) NOT NULL,
  `advertiser_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `status` enum('DRAFT','LIVE','PAUSED','CLOSED') NOT NULL DEFAULT 'DRAFT',
  `budget_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `budget_held` decimal(12,2) NOT NULL DEFAULT 0.00,
  `budget_spent` decimal(12,2) NOT NULL DEFAULT 0.00,
  `per_placement` decimal(12,2) DEFAULT NULL,
  `start_date` datetime(3) DEFAULT NULL,
  `end_date` datetime(3) DEFAULT NULL,
  `wizard_step` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `campaigns`
--

INSERT INTO `campaigns` (`id`, `advertiser_id`, `name`, `description`, `requirements`, `status`, `budget_total`, `budget_held`, `budget_spent`, `per_placement`, `start_date`, `end_date`, `wizard_step`, `created_at`, `updated_at`) VALUES
('00000000-0000-4000-8000-000000000101', '15b53100-709b-40b6-a78b-cbcf62b767b4', 'Summer Skincare Launch', 'Promote our new vitamin C serum line.', '1 Instagram post + 2 stories with product visible.', 'LIVE', 5000.00, 2500.00, 850.00, 500.00, '2026-06-01 00:00:00.000', '2026-08-31 00:00:00.000', 5, '2026-06-27 00:52:56.197', '2026-06-27 00:52:56.197'),
('00000000-0000-4000-8000-000000000102', '15b53100-709b-40b6-a78b-cbcf62b767b4', 'Holiday Gift Guide', 'Holiday season gift guide campaign.', NULL, 'DRAFT', 3000.00, 0.00, 0.00, NULL, NULL, NULL, 2, '2026-06-27 00:52:56.207', '2026-06-27 00:52:56.207'),
('00000000-0000-4000-8000-000000000103', 'f34f7840-3d71-4825-886c-1cdc9af61a37', 'Tech Gadget Review', 'Review our latest wireless earbuds.', NULL, 'LIVE', 2000.00, 1000.00, 0.00, 400.00, '2026-05-15 00:00:00.000', '2026-07-15 00:00:00.000', 5, '2026-06-27 00:52:56.218', '2026-06-27 00:52:56.218');

-- --------------------------------------------------------

--
-- Table structure for table `campaign_applications`
--

CREATE TABLE `campaign_applications` (
  `id` varchar(191) NOT NULL,
  `campaign_id` varchar(191) NOT NULL,
  `creator_user_id` varchar(191) NOT NULL,
  `page_id` varchar(191) NOT NULL,
  `message` text DEFAULT NULL,
  `proposed_price` decimal(12,2) NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `campaign_applications`
--

INSERT INTO `campaign_applications` (`id`, `campaign_id`, `creator_user_id`, `page_id`, `message`, `proposed_price`, `status`, `created_at`, `updated_at`) VALUES
('0ce22941-187e-49f5-9b41-c056fa5215b8', '00000000-0000-4000-8000-000000000103', '520a2cc6-d76b-4b11-a5da-47a38a1e078d', '00000000-0000-4000-8000-000000000001', 'cmlaskdmaskldasmkdmasdlkmaslkdmaskldmaskdmaskldmaslkmskldmaslkdmaskdmklasdmlkasmdasklmkasdmlkasmdklasmdkasmdklasmdaklsmaskldmaskdmaslkdmaskldmaskdmaskldmaskldmaslkdmaslkdmsalkdmaslkdmaskldmaslkdmaskldmaslkdmaskldmaslkdmaskdmaslkdmasklmaslkdmasdkmlsadkjashdjkhsdjhasdkjhasdkjhasdjhaskjdhaskjdhasdjhasdkjashdjashjashkasjhaskjhaskjhasjhasdjhasjdhasjdhasdjhsdkjhaskjdhasdjhaskdjasdjhasdkjhasdkjashdkjasdhaskjdhsakjdhsakjhsakdjhsadjhasdkjashdkjsahdkjashdjasdhaksjdhkajsdhaskjdhaskjdhasjdhaskjdhasjdhasdjhaskjdhaskjdhasdkjashkjashdkjashdjasdhaskjhaskjdhaskjdhsakjdhsjdhasdkjhasdkjashdjasdjasdhasdjkjasdkjasdkaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 4744.00, 'REJECTED', '2026-06-27 01:45:27.139', '2026-07-13 04:55:46.900'),
('2374eea4-46f2-4edc-bc69-460d54d5354a', '00000000-0000-4000-8000-000000000101', 'aff8886e-f9f4-4625-b829-707a75ae740d', '00000000-0000-4000-8000-000000000002', 'I would love to feature your products!', 600.00, 'PENDING', '2026-06-27 00:52:56.307', '2026-06-27 00:52:56.307'),
('8c588e7a-53f6-46bb-acec-23779d0d00e8', '00000000-0000-4000-8000-000000000103', '7a754017-013c-4438-bdc5-757449c8b849', '23284aef-0256-4dba-8c4e-f844ccffb70c', '', 400.00, 'APPROVED', '2026-07-13 04:09:53.661', '2026-07-13 04:39:15.681');

-- --------------------------------------------------------

--
-- Table structure for table `campaign_assets`
--

CREATE TABLE `campaign_assets` (
  `id` varchar(191) NOT NULL,
  `campaign_id` varchar(191) NOT NULL,
  `file_path` varchar(191) NOT NULL,
  `file_name` varchar(191) NOT NULL,
  `mime_type` varchar(191) NOT NULL,
  `file_size` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campaign_niches`
--

CREATE TABLE `campaign_niches` (
  `campaign_id` varchar(191) NOT NULL,
  `niche_id` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `campaign_niches`
--

INSERT INTO `campaign_niches` (`campaign_id`, `niche_id`) VALUES
('00000000-0000-4000-8000-000000000101', '9acdacac-1eae-4900-a7e6-66e42dc6fa9e');

-- --------------------------------------------------------

--
-- Table structure for table `campaign_platforms`
--

CREATE TABLE `campaign_platforms` (
  `campaign_id` varchar(191) NOT NULL,
  `platform_id` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `campaign_platforms`
--

INSERT INTO `campaign_platforms` (`campaign_id`, `platform_id`) VALUES
('00000000-0000-4000-8000-000000000101', '341896db-96ca-4d04-8edb-a2652cc582a5');

-- --------------------------------------------------------

--
-- Table structure for table `campaign_targeting`
--

CREATE TABLE `campaign_targeting` (
  `id` varchar(191) NOT NULL,
  `campaign_id` varchar(191) NOT NULL,
  `countries` text DEFAULT NULL,
  `cities` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collaborations`
--

CREATE TABLE `collaborations` (
  `id` varchar(191) NOT NULL,
  `campaign_id` varchar(191) NOT NULL,
  `creator_user_id` varchar(191) NOT NULL,
  `page_id` varchar(191) NOT NULL,
  `source` enum('APPLICATION','INVITATION') NOT NULL,
  `status` enum('REQUESTED','APPLICATION_PENDING','ACCEPTED','CONTENT_PROVIDED','PUBLISHED','PROOF_SUBMITTED','IN_REVIEW','VERIFIED','RELEASED','PAID_OUT','CANCELLED','DISPUTED') NOT NULL DEFAULT 'REQUESTED',
  `agreed_amount` decimal(12,2) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `collaborations`
--

INSERT INTO `collaborations` (`id`, `campaign_id`, `creator_user_id`, `page_id`, `source`, `status`, `agreed_amount`, `created_at`, `updated_at`) VALUES
('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000101', '520a2cc6-d76b-4b11-a5da-47a38a1e078d', '00000000-0000-4000-8000-000000000001', 'APPLICATION', 'PROOF_SUBMITTED', 500.00, '2026-06-27 00:52:56.252', '2026-06-27 00:52:56.252'),
('07306b73-39dc-4730-80d6-3b8f2b641a10', '00000000-0000-4000-8000-000000000103', '520a2cc6-d76b-4b11-a5da-47a38a1e078d', '00000000-0000-4000-8000-000000000001', 'APPLICATION', 'CANCELLED', 4744.00, '2026-06-27 01:45:27.155', '2026-07-13 04:55:46.908'),
('9ebbf588-890f-472c-9be0-3aa4cbde25be', '00000000-0000-4000-8000-000000000103', '7a754017-013c-4438-bdc5-757449c8b849', '23284aef-0256-4dba-8c4e-f844ccffb70c', 'APPLICATION', 'IN_REVIEW', 400.00, '2026-07-13 04:09:53.676', '2026-07-13 05:22:17.918');

-- --------------------------------------------------------

--
-- Table structure for table `collaboration_content`
--

CREATE TABLE `collaboration_content` (
  `id` varchar(191) NOT NULL,
  `collaboration_id` varchar(191) NOT NULL,
  `file_path` varchar(191) DEFAULT NULL,
  `file_name` varchar(191) DEFAULT NULL,
  `url` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `collaboration_content`
--

INSERT INTO `collaboration_content` (`id`, `collaboration_id`, `file_path`, `file_name`, `url`, `notes`, `created_at`) VALUES
('04241542-5ab8-4be7-a298-54eb96a4c266', '9ebbf588-890f-472c-9be0-3aa4cbde25be', '/uploads/content/1783917626931-921269911.jpeg', 'WhatsApp Image 2026-07-06 at 3.58.53 PM (1).jpeg', 'http://localhost:5173/creator/applications', 'Create a promptional video and review for my product', '2026-07-13 04:40:26.941');

-- --------------------------------------------------------

--
-- Table structure for table `collaboration_events`
--

CREATE TABLE `collaboration_events` (
  `id` varchar(191) NOT NULL,
  `collaboration_id` varchar(191) NOT NULL,
  `from_status` enum('REQUESTED','APPLICATION_PENDING','ACCEPTED','CONTENT_PROVIDED','PUBLISHED','PROOF_SUBMITTED','IN_REVIEW','VERIFIED','RELEASED','PAID_OUT','CANCELLED','DISPUTED') DEFAULT NULL,
  `to_status` enum('REQUESTED','APPLICATION_PENDING','ACCEPTED','CONTENT_PROVIDED','PUBLISHED','PROOF_SUBMITTED','IN_REVIEW','VERIFIED','RELEASED','PAID_OUT','CANCELLED','DISPUTED') NOT NULL,
  `actor_user_id` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `collaboration_events`
--

INSERT INTO `collaboration_events` (`id`, `collaboration_id`, `from_status`, `to_status`, `actor_user_id`, `notes`, `created_at`) VALUES
('07a5977f-c7be-4120-a460-d0f1f4efeb57', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'PROOF_SUBMITTED', 'IN_REVIEW', NULL, 'Auto moved to review', '2026-07-13 04:56:25.402'),
('0fb1a141-bb3c-46e6-bb1e-c3544b7d7d04', '07306b73-39dc-4730-80d6-3b8f2b641a10', 'APPLICATION_PENDING', 'CANCELLED', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'Proposal declined', '2026-07-13 04:55:46.917'),
('106615c9-8f69-4090-a074-7d9aebaced04', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'PUBLISHED', 'PROOF_SUBMITTED', '7a754017-013c-4438-bdc5-757449c8b849', '', '2026-07-13 04:56:25.355'),
('185fcd42-3ef3-496f-9c2b-ee5e9e41d215', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'ACCEPTED', 'CONTENT_PROVIDED', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', '', '2026-07-13 04:40:26.961'),
('1bb18047-ad73-4f22-ad0d-6e67580cad22', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'IN_REVIEW', 'PUBLISHED', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'Changes requested: cvbjnkmnjh', '2026-07-13 05:14:17.260'),
('1c874329-c72e-42d9-9cd4-182b95110885', '00000000-0000-4000-8000-000000000201', 'ACCEPTED', 'CONTENT_PROVIDED', NULL, 'Content sent', '2026-06-27 00:52:56.264'),
('2a37bffd-5a0b-485b-bb23-f1ff7edd50ee', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'CONTENT_PROVIDED', 'PUBLISHED', '7a754017-013c-4438-bdc5-757449c8b849', '', '2026-07-13 04:44:35.545'),
('34612f51-4208-47f4-abb5-b199e9e2a40f', '9ebbf588-890f-472c-9be0-3aa4cbde25be', NULL, 'APPLICATION_PENDING', NULL, 'Application submitted', '2026-07-13 04:09:53.683'),
('3f4425b2-b002-4b85-abeb-eb70dd6ee753', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'IN_REVIEW', 'PUBLISHED', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'dxfgvhbjnkm,.', '2026-07-13 04:53:20.317'),
('515bcd16-0ff2-4631-8a5b-01709f4e8b5b', '00000000-0000-4000-8000-000000000201', 'CONTENT_PROVIDED', 'PUBLISHED', NULL, 'Published', '2026-06-27 00:52:56.264'),
('58a48602-4711-48bd-9877-3b50437cea0a', '07306b73-39dc-4730-80d6-3b8f2b641a10', NULL, 'APPLICATION_PENDING', NULL, 'Application submitted', '2026-06-27 01:45:27.162'),
('679e07ee-f9a5-4231-b41a-3579b34bf28a', '00000000-0000-4000-8000-000000000201', NULL, 'APPLICATION_PENDING', NULL, 'Application submitted', '2026-06-27 00:52:56.264'),
('692a83c1-05e2-4491-9c76-d47ac18cfcd6', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'PUBLISHED', 'PROOF_SUBMITTED', '7a754017-013c-4438-bdc5-757449c8b849', '', '2026-07-13 04:44:46.081'),
('96ad8ca1-eb72-4e39-9afc-c66eaaa75bd9', '00000000-0000-4000-8000-000000000201', 'PUBLISHED', 'PROOF_SUBMITTED', NULL, 'Proof submitted', '2026-06-27 00:52:56.264'),
('a4628f3c-0c6f-4806-83e7-65d53d3e00cd', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'PROOF_SUBMITTED', 'IN_REVIEW', NULL, 'Auto moved to review', '2026-07-13 05:02:32.734'),
('a87cf376-dd4b-4ba6-9700-0959894311d4', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'PUBLISHED', 'PROOF_SUBMITTED', '7a754017-013c-4438-bdc5-757449c8b849', '', '2026-07-13 04:57:51.726'),
('b9edddad-0b2f-44ee-a4de-b8d2755ae2b7', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'PROOF_SUBMITTED', 'IN_REVIEW', NULL, 'Auto moved to review', '2026-07-13 04:44:46.115'),
('bf743aba-13db-4e9b-b059-b3db188d289a', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'APPLICATION_PENDING', 'ACCEPTED', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'Application approved', '2026-07-13 04:39:15.718'),
('c5ac7628-c75c-414d-aa71-d06e45ddcc15', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'PUBLISHED', 'PROOF_SUBMITTED', '7a754017-013c-4438-bdc5-757449c8b849', '', '2026-07-13 05:22:17.902'),
('c91156f0-499e-4923-8e3b-8a0d2a45937b', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'PUBLISHED', 'PROOF_SUBMITTED', '7a754017-013c-4438-bdc5-757449c8b849', '', '2026-07-13 05:02:32.689'),
('d3c235d3-db01-467e-aa9a-4bf840ce6670', '00000000-0000-4000-8000-000000000201', 'APPLICATION_PENDING', 'ACCEPTED', NULL, 'Approved', '2026-06-27 00:52:56.264'),
('d628861b-466f-4a43-8bab-26596f058b4c', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'IN_REVIEW', 'PUBLISHED', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'Changes requested: zxcvbnm,.', '2026-07-13 05:01:43.409'),
('ee5195fc-684a-4e95-a616-0f5f531c7e4d', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'PROOF_SUBMITTED', 'IN_REVIEW', NULL, 'Auto moved to review', '2026-07-13 05:22:17.925'),
('f5ed1bbe-4a67-4235-a2a5-e3104aba5dcf', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'PROOF_SUBMITTED', 'IN_REVIEW', NULL, 'Auto moved to review', '2026-07-13 04:57:51.752'),
('f9843f28-4ad6-46f3-8dc6-3d7dbe5a9eb0', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'IN_REVIEW', 'PUBLISHED', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'zxcvbnm,.asdfghjkl;', '2026-07-13 04:57:18.682');

-- --------------------------------------------------------

--
-- Table structure for table `collaboration_invitations`
--

CREATE TABLE `collaboration_invitations` (
  `id` varchar(191) NOT NULL,
  `campaign_id` varchar(191) NOT NULL,
  `creator_user_id` varchar(191) NOT NULL,
  `page_id` varchar(191) NOT NULL,
  `message` text DEFAULT NULL,
  `offered_amount` decimal(12,2) NOT NULL,
  `status` enum('PENDING','ACCEPTED','REJECTED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `collaboration_invitations`
--

INSERT INTO `collaboration_invitations` (`id`, `campaign_id`, `creator_user_id`, `page_id`, `message`, `offered_amount`, `status`, `created_at`, `updated_at`) VALUES
('3a810b48-6f3f-46b2-aeda-fe364aa73cbd', '00000000-0000-4000-8000-000000000101', 'aff8886e-f9f4-4625-b829-707a75ae740d', '00000000-0000-4000-8000-000000000002', 'We think you would be a great fit!', 550.00, 'PENDING', '2026-06-27 00:52:56.324', '2026-06-27 00:52:56.324');

-- --------------------------------------------------------

--
-- Table structure for table `collaboration_proofs`
--

CREATE TABLE `collaboration_proofs` (
  `id` varchar(191) NOT NULL,
  `collaboration_id` varchar(191) NOT NULL,
  `proof_url` varchar(191) NOT NULL,
  `screenshot_path` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `submitted_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `collaboration_proofs`
--

INSERT INTO `collaboration_proofs` (`id`, `collaboration_id`, `proof_url`, `screenshot_path`, `notes`, `submitted_at`) VALUES
('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000201', 'https://instagram.com/p/example', NULL, 'Posted as agreed', '2026-06-27 00:52:56.272'),
('1fb0e879-f7ae-432c-b700-355789e49a5c', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'http://localhost:5173/creator/applications', '/uploads/proofs/1783918671701-556362869.png', 'dsfdsgjhcfvbnm,nbvcbnm', '2026-07-13 04:57:51.708'),
('235c7b4f-a3b0-4665-b4f6-56ba4cd45b70', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'http://localhost:5173/creator/applications', '/uploads/proofs/1783918952649-298077667.png', 'xcvnbm,.', '2026-07-13 05:02:32.657'),
('5beceead-c546-48c7-9173-b4e8f93c0c27', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'http://localhost:5173/creator/applications', '/uploads/proofs/1783920137874-749476253.png', 'sdfghjklzxcvbhjk,', '2026-07-13 05:22:17.883'),
('8b5b6e25-1d5d-4b81-b1e1-d0e73d7c18fa', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'http://localhost:5173/creator/applications', '/uploads/proofs/1783917886055-464982593.png', NULL, '2026-07-13 04:44:46.064'),
('d898c73f-4703-4def-9a7e-5984abf5cbf2', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'http://localhost:5173/creator/applications', '/uploads/proofs/1783918585311-476066706.jpeg', NULL, '2026-07-13 04:56:25.318');

-- --------------------------------------------------------

--
-- Table structure for table `collaboration_review_feedback`
--

CREATE TABLE `collaboration_review_feedback` (
  `id` varchar(191) NOT NULL,
  `collaboration_id` varchar(191) NOT NULL,
  `notes` text NOT NULL,
  `file_path` varchar(191) DEFAULT NULL,
  `file_name` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `collaboration_review_feedback`
--

INSERT INTO `collaboration_review_feedback` (`id`, `collaboration_id`, `notes`, `file_path`, `file_name`, `created_at`) VALUES
('dd2e1197-8fca-4e1a-96b9-8260ef793d29', '9ebbf588-890f-472c-9be0-3aa4cbde25be', 'cvbjnkmnjh', '/uploads/reviews/1783919657232-826900833.png', 'image-removebg-preview.png', '2026-07-13 05:14:17.241');

-- --------------------------------------------------------

--
-- Table structure for table `creator_pages`
--

CREATE TABLE `creator_pages` (
  `id` varchar(191) NOT NULL,
  `creator_id` varchar(191) NOT NULL,
  `platform_id` varchar(191) NOT NULL,
  `niche_id` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `followers` int(11) NOT NULL DEFAULT 0,
  `avg_reach` int(11) NOT NULL DEFAULT 0,
  `engagement` double DEFAULT NULL,
  `country` varchar(191) DEFAULT NULL,
  `city` varchar(191) DEFAULT NULL,
  `verification_status` enum('PENDING','VERIFIED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `admin_verified_at` datetime(3) DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `custom_niche` varchar(191) DEFAULT NULL,
  `state` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `creator_pages`
--

INSERT INTO `creator_pages` (`id`, `creator_id`, `platform_id`, `niche_id`, `name`, `url`, `followers`, `avg_reach`, `engagement`, `country`, `city`, `verification_status`, `admin_verified_at`, `admin_notes`, `created_at`, `updated_at`, `custom_niche`, `state`) VALUES
('00000000-0000-4000-8000-000000000001', 'c99bff9a-eaa1-4859-898d-edf3127b1a28', '341896db-96ca-4d04-8edb-a2652cc582a5', '9acdacac-1eae-4900-a7e6-66e42dc6fa9e', '@stylebyjane', 'https://instagram.com/stylebyjane', 85000, 42000, 4.2, 'United States', 'Los Angeles', 'VERIFIED', '2026-06-27 00:52:56.126', NULL, '2026-06-27 00:52:56.138', '2026-06-27 00:52:56.138', NULL, NULL),
('00000000-0000-4000-8000-000000000002', 'dadbb660-eced-42d4-8b89-037378946517', 'a72a0dac-3d06-480c-a669-682c51ec1d75', '1d17d82a-4c3b-42da-b030-baa654b8882a', '@chefmarco', 'https://tiktok.com/@chefmarco', 120000, 65000, 5.8, 'Canada', 'Toronto', 'VERIFIED', '2026-06-27 00:52:56.136', NULL, '2026-06-27 00:52:56.148', '2026-06-27 00:52:56.148', NULL, NULL),
('00000000-0000-4000-8000-000000000003', 'dd4678a5-c696-4bb1-8976-96d7236fb156', 'a72a0dac-3d06-480c-a669-682c51ec1d75', 'f4226a2e-8776-4c3c-b11d-fde0b3906671', '@gamezone', 'https://tiktok.com/@gamezone', 45000, 22000, NULL, NULL, NULL, 'PENDING', NULL, NULL, '2026-06-27 00:52:56.158', '2026-06-27 00:52:56.158', NULL, NULL),
('23284aef-0256-4dba-8c4e-f844ccffb70c', '9e4ce1da-d4e1-4355-9360-8b9535e8a495', '349c6bf7-89f9-4a08-9632-aafaab813596', '58359f01-a990-4a33-84a6-d0500b46465b', 'Page 1', 'https://test.com/page1', 9000, 102, 15.2, 'US', 'Washington', 'VERIFIED', '2026-07-13 04:22:28.027', NULL, '2026-07-13 03:48:19.747', '2026-07-13 04:22:28.028', NULL, 'DC'),
('65c4e53e-ebe5-48eb-88a9-0c8e06259d86', '5ef43d38-62be-46aa-845b-7f0a5a55928a', 'a72a0dac-3d06-480c-a669-682c51ec1d75', '58359f01-a990-4a33-84a6-d0500b46465b', 'Page 1', 'https://benchlm.ai/benchmarks', 40000, 150, 35, 'IL', 'Bnei Ayish', 'PENDING', NULL, NULL, '2026-07-14 22:05:55.496', '2026-07-14 22:05:55.496', NULL, 'M');

-- --------------------------------------------------------

--
-- Table structure for table `creator_page_niches`
--

CREATE TABLE `creator_page_niches` (
  `page_id` varchar(191) NOT NULL,
  `niche_id` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `creator_page_niches`
--

INSERT INTO `creator_page_niches` (`page_id`, `niche_id`) VALUES
('00000000-0000-4000-8000-000000000001', '9acdacac-1eae-4900-a7e6-66e42dc6fa9e'),
('00000000-0000-4000-8000-000000000002', '1d17d82a-4c3b-42da-b030-baa654b8882a'),
('00000000-0000-4000-8000-000000000003', 'f4226a2e-8776-4c3c-b11d-fde0b3906671'),
('23284aef-0256-4dba-8c4e-f844ccffb70c', '58359f01-a990-4a33-84a6-d0500b46465b'),
('65c4e53e-ebe5-48eb-88a9-0c8e06259d86', '58359f01-a990-4a33-84a6-d0500b46465b');

-- --------------------------------------------------------

--
-- Table structure for table `creator_profiles`
--

CREATE TABLE `creator_profiles` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `photo` varchar(191) DEFAULT NULL,
  `country` varchar(191) DEFAULT NULL,
  `city` varchar(191) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `stripe_connect_account_id` varchar(191) DEFAULT NULL,
  `connect_status` enum('NOT_STARTED','PENDING','CONNECTED','RESTRICTED') NOT NULL DEFAULT 'NOT_STARTED',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `creator_profiles`
--

INSERT INTO `creator_profiles` (`id`, `user_id`, `photo`, `country`, `city`, `bio`, `stripe_connect_account_id`, `connect_status`, `created_at`, `updated_at`) VALUES
('085f3d63-5a62-40d4-937a-f05fe1b49c4e', '24a4499c-f77e-499f-aca2-88ca1ff091fd', NULL, 'AF', 'Jurm', 'Primary niche: Art & Design', NULL, 'NOT_STARTED', '2026-07-17 23:33:53.947', '2026-07-17 23:33:53.947'),
('0beebf6c-a0ed-4618-b962-9956fdc6f0c1', 'b716fb3a-0c5f-4453-89b6-d7cc1946eeaa', NULL, 'AF', 'Kabul', 'Primary niche: Travel', NULL, 'NOT_STARTED', '2026-07-17 23:29:28.234', '2026-07-17 23:29:28.234'),
('320e3591-477b-4b03-8089-9996d6630a82', '400b8937-da8a-4540-98b3-37dff6a0cac2', NULL, 'US', 'fgh', 'vhjkjhgfcfgh\n\nPrimary niche: Fashion & Beauty', NULL, 'NOT_STARTED', '2026-07-13 09:31:29.518', '2026-07-13 09:31:29.518'),
('5ef43d38-62be-46aa-845b-7f0a5a55928a', '613ccbc6-315d-4d9e-805c-01b51ebfbbf3', NULL, 'IL', 'Abū Ghaush', 'Primary niche: Beauty', NULL, 'NOT_STARTED', '2026-07-14 22:01:28.253', '2026-07-14 22:01:28.253'),
('9e4ce1da-d4e1-4355-9360-8b9535e8a495', '7a754017-013c-4438-bdc5-757449c8b849', NULL, '', '', '', NULL, 'NOT_STARTED', '2026-07-13 03:46:37.719', '2026-07-13 03:46:48.014'),
('b7bc3131-76e8-43e6-b462-6b2785179f43', 'd9bf0f5c-2a43-4e7a-996b-7a4969cc967c', NULL, '', '', '', NULL, 'NOT_STARTED', '2026-07-13 09:21:29.233', '2026-07-13 09:21:42.274'),
('c99bff9a-eaa1-4859-898d-edf3127b1a28', '520a2cc6-d76b-4b11-a5da-47a38a1e078d', NULL, 'United States', 'Los Angeles', 'Fashion & lifestyle content creator.', NULL, 'CONNECTED', '2026-06-27 00:52:56.098', '2026-06-27 00:52:56.098'),
('dadbb660-eced-42d4-8b89-037378946517', 'aff8886e-f9f4-4625-b829-707a75ae740d', NULL, 'Canada', 'Toronto', 'Food & recipe content.', NULL, 'PENDING', '2026-06-27 00:52:56.108', '2026-06-27 00:52:56.108'),
('dd4678a5-c696-4bb1-8976-96d7236fb156', 'e8d4d22c-a8d2-48df-b122-b0ed756e3018', NULL, 'Germany', 'Berlin', 'Gaming streams and reviews.', NULL, 'NOT_STARTED', '2026-06-27 00:52:56.125', '2026-06-27 00:52:56.125');

-- --------------------------------------------------------

--
-- Table structure for table `disputes`
--

CREATE TABLE `disputes` (
  `id` varchar(191) NOT NULL,
  `collaboration_id` varchar(191) NOT NULL,
  `raised_by_id` varchar(191) NOT NULL,
  `reason` text NOT NULL,
  `evidence` text DEFAULT NULL,
  `status` enum('OPEN','UNDER_REVIEW','RESOLVED','CLOSED') NOT NULL DEFAULT 'OPEN',
  `resolution` text DEFAULT NULL,
  `resolution_notes` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `resolved_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_templates`
--

CREATE TABLE `email_templates` (
  `id` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `subject` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` varchar(191) NOT NULL,
  `thread_id` varchar(191) NOT NULL,
  `sender_id` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `read_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `thread_id`, `sender_id`, `body`, `read_at`, `created_at`) VALUES
('22df1610-1e6c-4e81-bd80-f6d77ff7223f', 'bdb0d212-53f7-4eff-82eb-1631a3860cb8', '7a754017-013c-4438-bdc5-757449c8b849', '📸 Proof of publication submitted for brand review.\nPost: http://localhost:5173/creator/applications\nNotes: dsfdsgjhcfvbnm,nbvcbnm', '2026-07-13 05:00:20.102', '2026-07-13 04:57:51.766'),
('23671727-20f9-47de-b12c-d491a28cbd9c', 'bdb0d212-53f7-4eff-82eb-1631a3860cb8', '7a754017-013c-4438-bdc5-757449c8b849', 'fghjkl', '2026-07-13 08:47:24.191', '2026-07-13 08:45:07.703'),
('33b12b51-8561-43f6-bb5c-9d5d1dc37d5b', 'bdb0d212-53f7-4eff-82eb-1631a3860cb8', '7a754017-013c-4438-bdc5-757449c8b849', 'hi', '2026-07-13 04:40:31.551', '2026-07-13 04:39:38.520'),
('44897b9f-de53-4994-bd4c-3777232d0b94', '78757512-48a1-4272-be51-3887a9076b4c', '81811214-9840-467e-84a9-9e0d696f7d1c', 'Hello from fixed messaging module', '2026-07-13 04:07:53.625', '2026-06-27 01:49:46.891'),
('5ae01b80-7460-487d-b1a1-05477d367764', 'bdb0d212-53f7-4eff-82eb-1631a3860cb8', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'ok let me review', '2026-07-13 05:24:43.404', '2026-07-13 05:22:59.377'),
('892b1895-3513-42a6-b822-e50bb1643fab', 'bdb0d212-53f7-4eff-82eb-1631a3860cb8', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', '↩️ Changes requested on proof.\n\nzxcvbnm,.asdfghjkl;', '2026-07-13 04:57:21.209', '2026-07-13 04:57:18.706'),
('91983762-0ddb-4e2a-bc33-a35c9d5d6fbf', '78757512-48a1-4272-be51-3887a9076b4c', '520a2cc6-d76b-4b11-a5da-47a38a1e078d', 'Thanks! I will post by Friday.', '2026-06-27 01:47:02.523', '2026-06-27 00:52:56.299'),
('9d61359c-fcb3-48b9-ac36-e77591f40823', 'bdb0d212-53f7-4eff-82eb-1631a3860cb8', '7a754017-013c-4438-bdc5-757449c8b849', 'done', '2026-07-13 05:22:51.351', '2026-07-13 05:22:47.205'),
('aaddf4be-d479-4264-90de-077ec916b822', '78757512-48a1-4272-be51-3887a9076b4c', '81811214-9840-467e-84a9-9e0d696f7d1c', 'Looking forward to working together!', '2026-07-13 04:07:53.625', '2026-06-27 00:52:56.299'),
('d04b013a-20b4-44ea-b230-7ca2a45b22d9', 'bdb0d212-53f7-4eff-82eb-1631a3860cb8', '7a754017-013c-4438-bdc5-757449c8b849', '📸 Proof of publication submitted for brand review.\nPost: http://localhost:5173/creator/applications', '2026-07-13 05:00:20.102', '2026-07-13 04:56:25.420'),
('dbdaeb86-066c-48d2-8ab3-6a96ba3f1da0', '78757512-48a1-4272-be51-3887a9076b4c', '81811214-9840-467e-84a9-9e0d696f7d1c', 'Test message from advertiser', '2026-07-13 04:07:53.625', '2026-06-27 01:47:02.548'),
('f0b07c88-021c-41ed-99e0-086574f4b6f3', 'bdb0d212-53f7-4eff-82eb-1631a3860cb8', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', '↩️ Changes requested on proof.\n\ndxfgvhbjnkm,.', '2026-07-13 04:56:25.521', '2026-07-13 04:53:20.334');

-- --------------------------------------------------------

--
-- Table structure for table `message_threads`
--

CREATE TABLE `message_threads` (
  `id` varchar(191) NOT NULL,
  `collaboration_id` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `message_threads`
--

INSERT INTO `message_threads` (`id`, `collaboration_id`, `created_at`, `updated_at`) VALUES
('2f6be0b0-e9d0-41f4-89a5-31218c14f5a5', '07306b73-39dc-4730-80d6-3b8f2b641a10', '2026-06-27 01:45:27.177', '2026-06-27 01:45:27.177'),
('78757512-48a1-4272-be51-3887a9076b4c', '00000000-0000-4000-8000-000000000201', '2026-06-27 00:52:56.289', '2026-06-27 01:49:46.890'),
('bdb0d212-53f7-4eff-82eb-1631a3860cb8', '9ebbf588-890f-472c-9be0-3aa4cbde25be', '2026-07-13 04:09:53.694', '2026-07-13 08:45:07.709');

-- --------------------------------------------------------

--
-- Table structure for table `niches`
--

CREATE TABLE `niches` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `niches`
--

INSERT INTO `niches` (`id`, `name`, `slug`, `active`, `created_at`) VALUES
('01dfedc2-9f44-4fbc-8968-cd86cc2396eb', 'Skincare', 'skincare', 1, '2026-07-17 23:23:04.527'),
('0280c3d6-02fe-4afb-8d57-cd4377ba297d', 'Art & Design', 'art-design', 1, '2026-07-17 23:23:04.659'),
('04822718-9ddd-443e-a92f-f40baabb5245', 'Technology', 'technology', 1, '2026-07-17 23:23:04.563'),
('15e99048-7a6c-49e1-bb8d-3814ff3e7be0', 'Lifestyle', 'lifestyle', 1, '2026-06-27 00:52:55.701'),
('198481ff-9ad0-4bb8-b3ae-867c24575d24', 'Pets', 'pets', 1, '2026-07-17 23:23:04.641'),
('1d17d82a-4c3b-42da-b030-baa654b8882a', 'Food', 'food', 1, '2026-06-27 00:52:55.677'),
('24d33992-3ece-44a6-a76c-c123a950780e', 'News & Politics', 'news-politics', 1, '2026-07-17 23:23:04.678'),
('2e3d8296-2f82-404c-a54a-be5c08208863', 'DIY & Crafts', 'diy-crafts', 1, '2026-07-17 23:23:04.646'),
('3400cc56-0b30-43ff-b219-3d24e26a5b47', 'Entrepreneurship', 'entrepreneurship', 1, '2026-07-17 23:23:04.595'),
('3b3cce37-2f83-412d-8975-491ca04774dd', 'Music', 'music', 1, '2026-07-17 23:23:04.600'),
('46b229af-17a0-4ea7-ad63-db5cc871d09e', 'Science', 'science', 1, '2026-07-17 23:23:04.683'),
('4787d1e0-cfb8-4dd3-b559-9945ba57e6b4', 'Travel', 'travel', 1, '2026-06-27 00:52:55.684'),
('48b6ab18-8c96-48dc-9413-74c2013a7f48', 'Food & Cooking', 'food-cooking', 1, '2026-07-17 23:23:04.542'),
('559c3bd7-4663-4a86-a1a8-4d942268fa55', 'Dance', 'dance', 1, '2026-07-17 23:23:04.608'),
('58359f01-a990-4a33-84a6-d0500b46465b', 'Beauty', 'beauty', 1, '2026-06-27 00:52:55.665'),
('5ea3b83d-9f6e-45a5-8ad7-b6ab2e66074d', 'Luxury', 'luxury', 1, '2026-07-17 23:23:04.696'),
('6503b74e-ba20-4d02-8e22-6d67d7785876', 'Comedy', 'comedy', 1, '2026-07-17 23:23:04.613'),
('65907264-24ee-4c85-8aac-2917df70912f', 'Sports', 'sports', 1, '2026-07-17 23:23:04.629'),
('699de9ba-4348-46ce-9ce1-1d55ec489fbf', 'Sustainability', 'sustainability', 1, '2026-07-17 23:23:04.710'),
('80e6b4b3-9b4e-47ab-907a-24cc6e56c28c', 'Finance', 'finance', 1, '2026-06-27 00:52:55.707'),
('85b1a495-21d6-4ced-b820-8525579cc4cd', 'Entertainment', 'entertainment', 1, '2026-07-17 23:23:04.617'),
('887134ee-a585-4b07-bfaa-c441e7709ab3', 'Health & Wellness', 'health-wellness', 1, '2026-07-17 23:23:04.534'),
('8e1e1798-f4d6-43fc-b0e6-1cb0752114ac', 'Fitness', 'fitness', 1, '2026-06-27 00:52:55.689'),
('985bffd4-91b5-4436-8d8d-2f84c5ac0305', 'Home & Decor', 'home-decor', 1, '2026-07-17 23:23:04.650'),
('9acdacac-1eae-4900-a7e6-66e42dc6fa9e', 'Fashion', 'fashion', 1, '2026-06-27 00:52:55.656'),
('9d0c8180-3b25-4c17-a9b8-b99df6bd6a9f', 'Automotive', 'automotive', 1, '2026-07-17 23:23:04.672'),
('a12e6f2a-7967-4365-b1ee-874b805dba4d', 'Memes', 'memes', 1, '2026-07-17 23:23:04.728'),
('a251640b-a707-4386-b2d0-f54ece006382', 'Other', 'others', 1, '2026-07-17 23:23:04.742'),
('a6d766ac-26c5-44bb-b61e-d757728dba13', 'Business', 'business', 1, '2026-07-17 23:23:04.577'),
('ac85e3c2-ee78-4a4b-b7e7-20a78db81fe7', 'Tech', 'tech', 1, '2026-06-27 00:52:55.671'),
('bf797d7c-f1da-4b06-9515-fa7cb6ded6ad', 'Beauty & Makeup', 'beauty-makeup', 1, '2026-07-17 23:23:04.522'),
('c22e304c-50ac-4a5c-bd94-f3c069fcf478', 'Marketing', 'marketing', 1, '2026-07-17 23:23:04.590'),
('c305d533-f50b-4c78-90df-b1bfac5e4917', 'Movies & TV', 'movies-tv', 1, '2026-07-17 23:23:04.624'),
('c7e87cd4-6fc4-4e6c-8175-eb7c0c4938a6', 'Books & Literature', 'books-literature', 1, '2026-07-17 23:23:04.664'),
('cc319a0e-8406-4731-96b2-f7fbcb51f72e', 'Education', 'education', 1, '2026-06-27 00:52:55.713'),
('d185728a-6b18-454f-96d7-247740fd476a', 'Parenting', 'parenting', 1, '2026-07-17 23:23:04.633'),
('d7c8eb33-9f43-491e-93d4-7d83e49eba4f', 'Motivation & Self Improvement', 'motivation-self-improvement', 1, '2026-07-17 23:23:04.691'),
('dc4ef744-c06f-4e17-a971-493df29e1fd8', 'ASMR', 'asmr', 1, '2026-07-17 23:23:04.723'),
('e4b0017f-c8cb-47f2-9468-9aba6d20f637', 'NFT & Crypto', 'nft-crypto', 1, '2026-07-17 23:23:04.705'),
('e55d21b2-243f-4bcd-9b8a-796f0f3239e7', 'Religion & Spirituality', 'religion-spirituality', 1, '2026-07-17 23:23:04.715'),
('e8b4c4ca-a89e-43e4-a895-41858525486f', 'Videography', 'videography', 1, '2026-07-17 23:23:04.558'),
('f4226a2e-8776-4c3c-b11d-fde0b3906671', 'Gaming', 'gaming', 1, '2026-06-27 00:52:55.695'),
('f81271d9-e02a-4881-be98-802ccbcc3912', 'Photography', 'photography', 1, '2026-07-17 23:23:04.551');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `body` text DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `read_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `body`, `payload`, `read_at`, `created_at`) VALUES
('0a15693d-d938-4a14-9cf2-38ae86e347d2', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'message', 'New message — Tech Gadget Review', 'fghjkl', '{\"threadId\":\"bdb0d212-53f7-4eff-82eb-1631a3860cb8\",\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 09:08:12.005', '2026-07-13 08:45:07.718'),
('0c7539bd-db17-4ee3-8223-7610243f358d', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'collaboration', 'Proof submitted for review', 'Collaboration status: PROOF_SUBMITTED', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 09:08:22.876', '2026-07-13 04:44:46.099'),
('0cae9673-ffcf-41e5-942a-eb1324aec51f', '7a754017-013c-4438-bdc5-757449c8b849', 'page_verification', 'Page verified', 'Your page \"Page 1\" has been verified and is now live in the marketplace.', '{\"pageId\":\"23284aef-0256-4dba-8c4e-f844ccffb70c\",\"status\":\"VERIFIED\"}', '2026-07-13 08:46:37.738', '2026-07-13 04:22:28.038'),
('0f043709-1ef7-47fa-a8a1-0b19dd484265', '7a754017-013c-4438-bdc5-757449c8b849', 'collaboration', 'Changes requested on your proof', 'zxcvbnm,.asdfghjkl;', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\",\"threadId\":\"bdb0d212-53f7-4eff-82eb-1631a3860cb8\"}', '2026-07-13 08:46:37.738', '2026-07-13 04:57:18.730'),
('0fa07237-d85a-4518-bff6-e2020ac760c8', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'application', 'New campaign application', 'A creator applied to your campaign', '{\"applicationId\":\"8c588e7a-53f6-46bb-acec-23779d0d00e8\"}', '2026-07-13 09:08:22.876', '2026-07-13 04:09:53.703'),
('148c5e88-96ca-4242-9a86-932dcf4c81dd', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'collaboration', 'Creator marked as published', 'Collaboration status: PUBLISHED', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 09:08:22.876', '2026-07-13 04:44:35.553'),
('15d97ecc-82dc-4ad4-be2b-4936a9d5875c', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'collaboration', 'Creator marked as published', 'Changes requested: cvbjnkmnjh', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 09:08:22.876', '2026-07-13 05:14:17.267'),
('16c118a2-0521-4029-8872-8dc555d4a697', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'collaboration', 'Proof submitted for review', 'Collaboration status: PROOF_SUBMITTED', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 09:08:22.876', '2026-07-13 05:02:32.706'),
('1a4b3d28-27c2-4515-8387-88d12b5965c0', '7a754017-013c-4438-bdc5-757449c8b849', 'collaboration', 'Changes requested on your proof', 'zxcvbnm,.', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\",\"threadId\":\"bdb0d212-53f7-4eff-82eb-1631a3860cb8\"}', '2026-07-13 08:46:37.738', '2026-07-13 05:01:43.422'),
('28c3b857-894b-4001-880f-2f418e659373', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'collaboration', 'Creator marked as published', 'zxcvbnm,.asdfghjkl;', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 09:08:22.876', '2026-07-13 04:57:18.690'),
('2cbd1d47-51e7-4602-be97-1da99de41886', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'collaboration', 'Creator marked as published', 'Changes requested: zxcvbnm,.', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 09:08:22.876', '2026-07-13 05:01:43.414'),
('32700690-cb05-4729-a5fc-b67005b39400', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'message', 'New message — Tech Gadget Review', 'done', '{\"threadId\":\"bdb0d212-53f7-4eff-82eb-1631a3860cb8\",\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 09:08:15.308', '2026-07-13 05:22:47.229'),
('3b3f9ba0-c14b-409f-b119-ef1ca7979e99', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'collaboration', 'Proof submitted for review', 'Collaboration status: PROOF_SUBMITTED', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 09:08:18.763', '2026-07-13 05:22:17.909'),
('40a3fc25-9223-43ce-88cd-4657f3d1cd3e', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'collaboration', 'Proof submitted for review', 'Collaboration status: PROOF_SUBMITTED', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 09:08:22.876', '2026-07-13 04:57:51.733'),
('5f1be0b7-9072-4633-a300-4ed151025ae4', '520a2cc6-d76b-4b11-a5da-47a38a1e078d', 'collaboration', 'Proof submitted', 'Awaiting verification', NULL, '2026-06-27 01:46:39.438', '2026-06-27 00:52:56.333'),
('64fa42c0-6bc0-4739-b5eb-058c89563d4c', 'aff8886e-f9f4-4625-b829-707a75ae740d', 'invitation', 'New invitation', 'You have a collaboration request', NULL, NULL, '2026-06-27 00:52:56.333'),
('7a2e6fbc-85c4-4fbf-8e3e-20729047073f', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'collaboration', 'Proof submitted for review', 'Collaboration status: PROOF_SUBMITTED', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 09:08:22.876', '2026-07-13 04:56:25.367'),
('922b45ca-9da7-4ad9-8159-60218e4c8672', '7a754017-013c-4438-bdc5-757449c8b849', 'collaboration', 'Changes requested on your proof', 'cvbjnkmnjh', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\",\"threadId\":\"bdb0d212-53f7-4eff-82eb-1631a3860cb8\"}', '2026-07-13 08:46:37.738', '2026-07-13 05:14:17.275'),
('b3b692b3-b938-4c09-8402-78d4bfd12b1b', '520a2cc6-d76b-4b11-a5da-47a38a1e078d', 'message', 'New message — Summer Skincare Launch', 'Hello from fixed messaging module', '{\"threadId\":\"78757512-48a1-4272-be51-3887a9076b4c\",\"collaborationId\":\"00000000-0000-4000-8000-000000000201\"}', NULL, '2026-06-27 01:49:46.908'),
('b84b89c6-d2bc-4446-adeb-ab298ee95af2', '7a754017-013c-4438-bdc5-757449c8b849', 'collaboration', 'Promotional content provided', 'Collaboration status: CONTENT_PROVIDED', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 08:46:37.738', '2026-07-13 04:40:26.968'),
('b909cbd5-7994-492a-bbc5-eacc18602e99', '7a754017-013c-4438-bdc5-757449c8b849', 'page_verification', 'Page verified', 'Your page \"Page 1\" has been verified and is now live in the marketplace.', '{\"pageId\":\"23284aef-0256-4dba-8c4e-f844ccffb70c\",\"status\":\"VERIFIED\"}', '2026-07-13 08:46:37.738', '2026-07-13 04:07:50.175'),
('babd924c-aa0b-4393-8de1-d3ca12db5cad', '7a754017-013c-4438-bdc5-757449c8b849', 'collaboration', 'Collaboration accepted', 'Application approved', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 08:46:37.738', '2026-07-13 04:39:15.725'),
('bb9b6c6e-3b02-47f7-9431-76fb5d087859', '7a754017-013c-4438-bdc5-757449c8b849', 'message', 'New message — Tech Gadget Review', 'ok let me review', '{\"threadId\":\"bdb0d212-53f7-4eff-82eb-1631a3860cb8\",\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 08:46:37.738', '2026-07-13 05:22:59.389'),
('c21617ff-4516-4db7-8bd7-20d30eab9028', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'collaboration', 'Creator marked as published', 'dxfgvhbjnkm,.', '{\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 09:08:22.876', '2026-07-13 04:53:20.323'),
('d7fe107e-8e48-412a-bfb2-d3cc20639cd1', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'application', 'New campaign application', 'A creator applied to your campaign', '{\"applicationId\":\"0ce22941-187e-49f5-9b41-c056fa5215b8\"}', '2026-07-13 09:08:22.876', '2026-06-27 01:45:27.192'),
('eba14024-7947-4a83-8577-538a401f90a4', '520a2cc6-d76b-4b11-a5da-47a38a1e078d', 'application', 'Proposal declined', 'The brand declined your proposal for this campaign.', '{\"applicationId\":\"0ce22941-187e-49f5-9b41-c056fa5215b8\",\"campaignId\":\"00000000-0000-4000-8000-000000000103\"}', NULL, '2026-07-13 04:55:46.945'),
('f49a54af-4c15-4f37-b873-b4ffe3f8bb68', '81811214-9840-467e-84a9-9e0d696f7d1c', 'application', 'New application', 'Creator applied to Summer Skincare Launch', NULL, NULL, '2026-06-27 00:52:56.333'),
('f89d8cf2-5572-4060-9a1f-fdc62f779631', '97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'message', 'New message — Tech Gadget Review', 'hi', '{\"threadId\":\"bdb0d212-53f7-4eff-82eb-1631a3860cb8\",\"collaborationId\":\"9ebbf588-890f-472c-9be0-3aa4cbde25be\"}', '2026-07-13 09:08:22.876', '2026-07-13 04:39:38.547');

-- --------------------------------------------------------

--
-- Table structure for table `payouts`
--

CREATE TABLE `payouts` (
  `id` varchar(191) NOT NULL,
  `creator_user_id` varchar(191) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `fee_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `net_amount` decimal(12,2) NOT NULL,
  `status` enum('PENDING','PROCESSING','PAID','FAILED') NOT NULL DEFAULT 'PENDING',
  `stripe_transfer_id` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `platforms`
--

CREATE TABLE `platforms` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `icon` varchar(191) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `platforms`
--

INSERT INTO `platforms` (`id`, `name`, `slug`, `icon`, `active`, `created_at`) VALUES
('1f712070-a079-489f-bb7d-c525083ecbd4', 'YouTube', 'youtube', 'youtube', 1, '2026-06-27 00:52:55.636'),
('341896db-96ca-4d04-8edb-a2652cc582a5', 'Instagram', 'instagram', 'instagram', 1, '2026-06-27 00:52:55.593'),
('349c6bf7-89f9-4a08-9632-aafaab813596', 'Facebook', 'facebook', 'facebook', 1, '2026-06-27 00:52:55.645'),
('84dc3ca2-7732-4d5a-adc6-ac371acb951c', 'Twitter/X', 'twitter', 'twitter', 1, '2026-06-27 00:52:55.650'),
('a72a0dac-3d06-480c-a669-682c51ec1d75', 'TikTok', 'tiktok', 'tiktok', 1, '2026-06-27 00:52:55.624');

-- --------------------------------------------------------

--
-- Table structure for table `platform_settings`
--

CREATE TABLE `platform_settings` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`value`)),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `platform_settings`
--

INSERT INTO `platform_settings` (`id`, `key`, `value`, `updated_at`) VALUES
('01091c24-5486-4ae3-8fba-964cc16ad554', 'commission_rate', '0.15', '2026-06-27 00:52:55.545');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` varchar(191) NOT NULL,
  `reporter_id` varchar(191) NOT NULL,
  `entity_type` varchar(191) NOT NULL,
  `entity_id` varchar(191) NOT NULL,
  `reason` text NOT NULL,
  `status` enum('OPEN','DISMISSED','WARNED','REMOVED') NOT NULL DEFAULT 'OPEN',
  `resolution` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `resolved_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review_queue_items`
--

CREATE TABLE `review_queue_items` (
  `id` varchar(191) NOT NULL,
  `type` enum('REPORT','DISPUTE','PROOF') NOT NULL,
  `entity_id` varchar(191) NOT NULL,
  `status` enum('PENDING','IN_PROGRESS','RESOLVED') NOT NULL DEFAULT 'PENDING',
  `assigned_to` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `resolved_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `review_queue_items`
--

INSERT INTO `review_queue_items` (`id`, `type`, `entity_id`, `status`, `assigned_to`, `created_at`, `resolved_at`) VALUES
('16461d23-34eb-45f4-89c9-3dcc67773317', 'PROOF', '23284aef-0256-4dba-8c4e-f844ccffb70c', 'RESOLVED', NULL, '2026-07-13 04:20:44.587', '2026-07-13 04:22:28.061'),
('66836d3c-cc07-4ba9-a7ae-8bc94df7abe6', 'PROOF', '23284aef-0256-4dba-8c4e-f844ccffb70c', 'RESOLVED', NULL, '2026-07-13 03:48:19.758', '2026-07-13 04:07:50.203'),
('f34769fe-0a04-4a71-8c2a-6c50f1edda9a', 'PROOF', '65c4e53e-ebe5-48eb-88a9-0c8e06259d86', 'PENDING', NULL, '2026-07-14 22:05:55.519', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `saved_creators`
--

CREATE TABLE `saved_creators` (
  `id` varchar(191) NOT NULL,
  `advertiser_id` varchar(191) NOT NULL,
  `creator_user_id` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` varchar(191) NOT NULL,
  `advertiser_id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'member',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` varchar(191) NOT NULL,
  `wallet_owner_type` varchar(191) NOT NULL,
  `wallet_owner_id` varchar(191) NOT NULL,
  `type` enum('FUND','HOLD','RELEASE','COMMISSION','REFUND','PAYOUT') NOT NULL,
  `status` enum('PENDING','COMPLETED','FAILED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `gross` decimal(12,2) NOT NULL,
  `fee_pct` decimal(5,4) NOT NULL DEFAULT 0.1500,
  `fee_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `net` decimal(12,2) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `collaboration_id` varchar(191) DEFAULT NULL,
  `stripe_payment_intent_id` varchar(191) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `wallet_owner_type`, `wallet_owner_id`, `type`, `status`, `gross`, `fee_pct`, `fee_amount`, `net`, `description`, `collaboration_id`, `stripe_payment_intent_id`, `metadata`, `created_at`) VALUES
('0f4f2618-a9a4-4df9-8ee0-856f2a550ecf', 'ADVERTISER', 'f34f7840-3d71-4825-886c-1cdc9af61a37', 'FUND', 'COMPLETED', 5000.00, 0.0000, 0.00, 5000.00, 'Wallet top-up (mock)', NULL, NULL, NULL, '2026-07-13 05:00:14.796'),
('2255db48-61a6-4a10-893e-c1d2f671aca9', 'ADVERTISER', 'f34f7840-3d71-4825-886c-1cdc9af61a37', 'FUND', 'COMPLETED', 1000.00, 0.0000, 0.00, 1000.00, 'Wallet top-up (mock)', NULL, NULL, NULL, '2026-07-13 05:34:22.736'),
('74703db7-9355-450b-989c-897cfcb248c4', 'ADVERTISER', 'f34f7840-3d71-4825-886c-1cdc9af61a37', 'HOLD', 'COMPLETED', 400.00, 0.0000, 0.00, 400.00, 'Funds held for collaboration', '9ebbf588-890f-472c-9be0-3aa4cbde25be', NULL, NULL, '2026-07-13 04:39:15.703'),
('8cd7e8b1-0ac7-4fba-a65c-0adc15667717', 'ADVERTISER', 'f34f7840-3d71-4825-886c-1cdc9af61a37', 'FUND', 'COMPLETED', 100.00, 0.0000, 0.00, 100.00, 'Wallet top-up (mock)', NULL, NULL, NULL, '2026-07-13 05:00:12.332'),
('9cc5ad06-296d-4756-841c-25c7e1709955', 'ADVERTISER', 'f34f7840-3d71-4825-886c-1cdc9af61a37', 'FUND', 'COMPLETED', 1000.00, 0.0000, 0.00, 1000.00, 'Wallet top-up (mock)', NULL, NULL, NULL, '2026-07-13 05:00:17.357'),
('db405def-25c4-4228-8998-2ca571adcc4b', 'ADVERTISER', 'f34f7840-3d71-4825-886c-1cdc9af61a37', 'FUND', 'COMPLETED', 100.00, 0.0000, 0.00, 100.00, 'Wallet top-up (mock)', NULL, NULL, NULL, '2026-07-13 08:08:59.234'),
('fc9c1f92-cd47-4d16-8257-308613751330', 'ADVERTISER', 'f34f7840-3d71-4825-886c-1cdc9af61a37', 'FUND', 'COMPLETED', 1000.00, 0.0000, 0.00, 1000.00, 'Wallet top-up (mock)', NULL, NULL, NULL, '2026-07-13 05:00:03.177');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(191) NOT NULL,
  `role` enum('ADVERTISER','CREATOR','ADMIN') NOT NULL,
  `admin_role` enum('SUPER','MODERATOR','FINANCE') DEFAULT NULL,
  `status` enum('PENDING','ACTIVE','SUSPENDED','RESTRICTED') NOT NULL DEFAULT 'PENDING',
  `email_verified_at` datetime(3) DEFAULT NULL,
  `onboarding_step` int(11) NOT NULL DEFAULT 0,
  `onboarding_done` tinyint(1) NOT NULL DEFAULT 0,
  `reset_token` varchar(191) DEFAULT NULL,
  `reset_token_expiry` datetime(3) DEFAULT NULL,
  `verify_token` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `admin_role`, `status`, `email_verified_at`, `onboarding_step`, `onboarding_done`, `reset_token`, `reset_token_expiry`, `verify_token`, `created_at`, `updated_at`) VALUES
('03e37379-d82c-4d52-a38f-f57ba683d6ca', 'finance@collabcircle.com', '$2b$12$PdMAzns.xBPDTX1xzJOZaekgWeSP5IYS1OSjxi2ceRrLLC.Lf8xMS', 'ADMIN', 'FINANCE', 'ACTIVE', '2026-06-27 00:52:56.052', 0, 1, NULL, NULL, NULL, '2026-06-27 00:52:56.064', '2026-06-27 00:52:56.064'),
('0567c23d-5594-4f99-bcff-e80a3d48bc46', 'admin@collabcircle.com', '$2b$12$PdMAzns.xBPDTX1xzJOZaekgWeSP5IYS1OSjxi2ceRrLLC.Lf8xMS', 'ADMIN', 'SUPER', 'ACTIVE', '2026-06-27 00:52:56.033', 0, 1, NULL, NULL, NULL, '2026-06-27 00:52:56.046', '2026-06-27 00:52:56.046'),
('24a4499c-f77e-499f-aca2-88ca1ff091fd', 'taimur1@yopmail.com', '$2b$12$EJw/UTDr28vmaksDU1csKOiwHRXOG02/yl19HyEtxPot0RCIgDX/i', 'CREATOR', NULL, 'ACTIVE', '2026-07-17 23:33:53.946', 2, 1, NULL, NULL, NULL, '2026-07-17 23:33:53.947', '2026-07-18 00:02:53.682'),
('400b8937-da8a-4540-98b3-37dff6a0cac2', 'creator1@yopmail.com', '$2b$12$iDYMPd7HZzjS9eY/2IOQSefG5wbNbh3qqaZKyz.ZuAKg18m3s1lY6', 'CREATOR', NULL, 'ACTIVE', '2026-07-13 09:31:29.516', 2, 1, NULL, NULL, NULL, '2026-07-13 09:31:29.518', '2026-07-13 09:32:24.612'),
('520a2cc6-d76b-4b11-a5da-47a38a1e078d', 'creator@influencer.com', '$2b$12$PdMAzns.xBPDTX1xzJOZaekgWeSP5IYS1OSjxi2ceRrLLC.Lf8xMS', 'CREATOR', NULL, 'ACTIVE', '2026-06-27 00:52:56.086', 0, 1, NULL, NULL, NULL, '2026-06-27 00:52:56.098', '2026-06-27 00:52:56.098'),
('613ccbc6-315d-4d9e-805c-01b51ebfbbf3', 'creator3@yopmail.com', '$2b$12$qM9s2Es2aYYozbzZTF1awOAWz5Wl0iv2fn/kL6s97fX6J.9mabjn2', 'CREATOR', NULL, 'ACTIVE', '2026-07-14 22:01:28.244', 2, 1, NULL, NULL, NULL, '2026-07-14 22:01:28.253', '2026-07-14 22:07:16.121'),
('70bfd0ea-c1d7-443c-98bb-c51092749d8f', 'moderator@collabcircle.com', '$2b$12$PdMAzns.xBPDTX1xzJOZaekgWeSP5IYS1OSjxi2ceRrLLC.Lf8xMS', 'ADMIN', 'MODERATOR', 'ACTIVE', '2026-06-27 00:52:56.044', 0, 1, NULL, NULL, NULL, '2026-06-27 00:52:56.056', '2026-06-27 00:52:56.056'),
('7a754017-013c-4438-bdc5-757449c8b849', 'creator2@influencer.com', '$2b$12$qy78LOwgSoUif8qpi81k5..192rDwmJ67xh2.RGa7g/W7kMtdw0Za', 'CREATOR', NULL, 'ACTIVE', '2026-07-13 03:46:37.715', 3, 1, NULL, NULL, '10a1889e-dcd9-4e29-9739-cc017f646071', '2026-07-13 03:46:37.719', '2026-07-13 03:46:48.021'),
('81811214-9840-467e-84a9-9e0d696f7d1c', 'advertiser@brand.com', '$2b$12$PdMAzns.xBPDTX1xzJOZaekgWeSP5IYS1OSjxi2ceRrLLC.Lf8xMS', 'ADVERTISER', NULL, 'ACTIVE', '2026-06-27 00:52:56.067', 0, 1, NULL, NULL, NULL, '2026-06-27 00:52:56.079', '2026-06-27 00:52:56.079'),
('97b091e9-becc-4cd4-8c7f-c4ebfb2a5cb0', 'advertiser2@tech.com', '$2b$12$PdMAzns.xBPDTX1xzJOZaekgWeSP5IYS1OSjxi2ceRrLLC.Lf8xMS', 'ADVERTISER', NULL, 'ACTIVE', '2026-06-27 00:52:56.079', 0, 1, NULL, NULL, NULL, '2026-06-27 00:52:56.091', '2026-06-27 00:52:56.091'),
('aff8886e-f9f4-4625-b829-707a75ae740d', 'creator2@food.com', '$2b$12$PdMAzns.xBPDTX1xzJOZaekgWeSP5IYS1OSjxi2ceRrLLC.Lf8xMS', 'CREATOR', NULL, 'ACTIVE', '2026-06-27 00:52:56.096', 0, 1, NULL, NULL, NULL, '2026-06-27 00:52:56.108', '2026-06-27 00:52:56.108'),
('b716fb3a-0c5f-4453-89b6-d7cc1946eeaa', 'taimur@yopmail.com', '$2b$12$uzhcSdYBeeUFv3x9PxUHQOCP6cU9AUEIKWplzckNqTJOO8BauCWiS', 'CREATOR', NULL, 'ACTIVE', '2026-07-17 23:29:28.232', 2, 1, NULL, NULL, NULL, '2026-07-17 23:29:28.234', '2026-07-17 23:29:45.909'),
('d9bf0f5c-2a43-4e7a-996b-7a4969cc967c', 'creator@yopmail.com', '$2b$12$VBD8U0jMjphGeLLTiET1t.P0FckDm6uB1rCZ2HNPZ/Qztx2UGkAfy', 'CREATOR', NULL, 'ACTIVE', '2026-07-13 09:21:29.231', 3, 1, NULL, NULL, NULL, '2026-07-13 09:21:29.233', '2026-07-13 09:21:42.281'),
('e8d4d22c-a8d2-48df-b122-b0ed756e3018', 'creator3@gaming.com', '$2b$12$PdMAzns.xBPDTX1xzJOZaekgWeSP5IYS1OSjxi2ceRrLLC.Lf8xMS', 'CREATOR', NULL, 'ACTIVE', '2026-06-27 00:52:56.113', 0, 1, NULL, NULL, NULL, '2026-06-27 00:52:56.125', '2026-06-27 00:52:56.125');

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` varchar(191) NOT NULL,
  `owner_type` varchar(191) NOT NULL,
  `owner_id` varchar(191) NOT NULL,
  `balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `held_balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`id`, `owner_type`, `owner_id`, `balance`, `held_balance`, `created_at`, `updated_at`) VALUES
('2ebbd565-8d32-4c9b-b5a6-2cfa467a1c78', 'CREATOR', 'be355fd9-c230-4001-a6d0-89e15128bea1', 0.00, 0.00, '2026-07-13 09:23:53.725', '2026-07-13 09:23:53.725'),
('44effc9f-2c71-4e28-86b3-c7f57f50aa72', 'ADVERTISER', 'f34f7840-3d71-4825-886c-1cdc9af61a37', 12800.00, 400.00, '2026-06-27 00:52:56.177', '2026-07-13 08:08:59.195'),
('4b5d4a1a-1e39-4976-9594-a111b2ff5ab0', 'CREATOR', '613ccbc6-315d-4d9e-805c-01b51ebfbbf3', 0.00, 0.00, '2026-07-14 22:01:28.282', '2026-07-14 22:01:28.282'),
('6a3f32b1-cd42-4de0-9038-5a97d14bce87', 'ADVERTISER', '15b53100-709b-40b6-a78b-cbcf62b767b4', 10000.00, 2500.00, '2026-06-27 00:52:56.168', '2026-06-27 00:52:56.168'),
('6b429a53-7c7d-4d37-84ce-92566225dd6b', 'CREATOR', '7a754017-013c-4438-bdc5-757449c8b849', 0.00, 0.00, '2026-07-13 03:46:37.761', '2026-07-13 03:46:37.761'),
('82cae0b7-2548-4e5f-9a4f-793116c8502b', 'CREATOR', 'aff8886e-f9f4-4625-b829-707a75ae740d', 0.00, 0.00, '2026-06-27 00:52:56.190', '2026-06-27 00:52:56.190'),
('8fb326b1-a752-4658-a325-30c917154cd3', 'CREATOR', '520a2cc6-d76b-4b11-a5da-47a38a1e078d', 850.00, 0.00, '2026-06-27 00:52:56.184', '2026-06-27 00:52:56.184'),
('acaa3f59-47ec-4a8c-827d-065fe095555d', 'CREATOR', '24a4499c-f77e-499f-aca2-88ca1ff091fd', 0.00, 0.00, '2026-07-17 23:33:53.961', '2026-07-17 23:33:53.961'),
('b02123e6-05af-4880-b7c9-b29cdce85fcb', 'CREATOR', 'b716fb3a-0c5f-4453-89b6-d7cc1946eeaa', 0.00, 0.00, '2026-07-17 23:29:28.246', '2026-07-17 23:29:28.246'),
('b6185817-4d9f-44ec-8ec2-b58785419e9f', 'CREATOR', '400b8937-da8a-4540-98b3-37dff6a0cac2', 0.00, 0.00, '2026-07-13 09:31:29.529', '2026-07-13 09:31:29.529'),
('df8e7e8f-b49f-419f-9c6f-f208983ee94a', 'CREATOR', 'd9bf0f5c-2a43-4e7a-996b-7a4969cc967c', 0.00, 0.00, '2026-07-13 09:21:29.249', '2026-07-13 09:21:29.249');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('11e2b15d-58df-4525-ba0a-e5279b305252', '2d2022ed6d76e5353f141029b492e0db6c92a9882f6e3890d0e76fb50ca8b659', NULL, '20260713000000_page_verification_fields', 'A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260713000000_page_verification_fields\n\nDatabase error code: 1060\n\nDatabase error:\nDuplicate column name \'state\'\n\nPlease check the query number 1 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20260713000000_page_verification_fields\"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name=\"20260713000000_page_verification_fields\"\n             at schema-engine\\commands\\src\\commands\\apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:260', '2026-07-17 23:25:08.660', '2026-07-17 23:23:48.696', 0),
('14e77402-691a-441c-a644-326993d7d6a6', '2d2022ed6d76e5353f141029b492e0db6c92a9882f6e3890d0e76fb50ca8b659', '2026-07-17 23:25:08.661', '20260713000000_page_verification_fields', '', NULL, '2026-07-17 23:25:08.661', 0),
('1fba09db-a4ce-4a12-b544-d2a896010c09', 'fb7da68d4bd741afc6b32d87e8bb6ce7ce0f864084b320398ff6998cab61006c', '2026-06-27 00:52:54.697', '20260627005247_init', NULL, NULL, '2026-06-27 00:52:47.461', 1),
('2f0158e6-1582-4515-838b-1a888b8856b7', '042b26a20c23f30a87ca14a5f1beeec1d336251347530d6160374eed520ee508', '2026-07-17 23:25:14.708', '20260714000000_collaboration_review_feedback', '', NULL, '2026-07-17 23:25:14.708', 0),
('a2096523-2472-47a9-9d28-79500b51d003', '4250176f8b1b81dbc96544bdadb83f9180905accac38d2c79c1ef54d47562bc4', '2026-07-17 23:25:21.096', '20260714010000_advertiser_social_links', NULL, NULL, '2026-07-17 23:25:21.064', 1),
('f760d25f-29fb-4ca3-927e-3c67e6aed522', 'dc31f3c4fac913fa93196727a6d9e0ecf6f575aa6bacbd8f1ae68b6421205f19', '2026-07-17 23:25:21.310', '20260718000000_creator_page_niches', NULL, NULL, '2026-07-17 23:25:21.099', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `advertiser_profiles`
--
ALTER TABLE `advertiser_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `advertiser_profiles_user_id_key` (`user_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audit_logs_actor_id_fkey` (`actor_id`);

--
-- Indexes for table `campaigns`
--
ALTER TABLE `campaigns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `campaigns_advertiser_id_fkey` (`advertiser_id`);

--
-- Indexes for table `campaign_applications`
--
ALTER TABLE `campaign_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `campaign_applications_campaign_id_fkey` (`campaign_id`),
  ADD KEY `campaign_applications_page_id_fkey` (`page_id`);

--
-- Indexes for table `campaign_assets`
--
ALTER TABLE `campaign_assets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `campaign_assets_campaign_id_fkey` (`campaign_id`);

--
-- Indexes for table `campaign_niches`
--
ALTER TABLE `campaign_niches`
  ADD PRIMARY KEY (`campaign_id`,`niche_id`),
  ADD KEY `campaign_niches_niche_id_fkey` (`niche_id`);

--
-- Indexes for table `campaign_platforms`
--
ALTER TABLE `campaign_platforms`
  ADD PRIMARY KEY (`campaign_id`,`platform_id`),
  ADD KEY `campaign_platforms_platform_id_fkey` (`platform_id`);

--
-- Indexes for table `campaign_targeting`
--
ALTER TABLE `campaign_targeting`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `campaign_targeting_campaign_id_key` (`campaign_id`);

--
-- Indexes for table `collaborations`
--
ALTER TABLE `collaborations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collaborations_campaign_id_fkey` (`campaign_id`),
  ADD KEY `collaborations_page_id_fkey` (`page_id`);

--
-- Indexes for table `collaboration_content`
--
ALTER TABLE `collaboration_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collaboration_content_collaboration_id_fkey` (`collaboration_id`);

--
-- Indexes for table `collaboration_events`
--
ALTER TABLE `collaboration_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collaboration_events_collaboration_id_fkey` (`collaboration_id`);

--
-- Indexes for table `collaboration_invitations`
--
ALTER TABLE `collaboration_invitations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collaboration_invitations_campaign_id_fkey` (`campaign_id`),
  ADD KEY `collaboration_invitations_page_id_fkey` (`page_id`);

--
-- Indexes for table `collaboration_proofs`
--
ALTER TABLE `collaboration_proofs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collaboration_proofs_collaboration_id_fkey` (`collaboration_id`);

--
-- Indexes for table `collaboration_review_feedback`
--
ALTER TABLE `collaboration_review_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collaboration_review_feedback_collaboration_id_fkey` (`collaboration_id`);

--
-- Indexes for table `creator_pages`
--
ALTER TABLE `creator_pages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creator_pages_creator_id_fkey` (`creator_id`),
  ADD KEY `creator_pages_platform_id_fkey` (`platform_id`),
  ADD KEY `creator_pages_niche_id_fkey` (`niche_id`);

--
-- Indexes for table `creator_page_niches`
--
ALTER TABLE `creator_page_niches`
  ADD PRIMARY KEY (`page_id`,`niche_id`),
  ADD KEY `creator_page_niches_niche_id_fkey` (`niche_id`);

--
-- Indexes for table `creator_profiles`
--
ALTER TABLE `creator_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `creator_profiles_user_id_key` (`user_id`);

--
-- Indexes for table `disputes`
--
ALTER TABLE `disputes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `disputes_collaboration_id_fkey` (`collaboration_id`),
  ADD KEY `disputes_raised_by_id_fkey` (`raised_by_id`);

--
-- Indexes for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_templates_slug_key` (`slug`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_thread_id_fkey` (`thread_id`),
  ADD KEY `messages_sender_id_fkey` (`sender_id`);

--
-- Indexes for table `message_threads`
--
ALTER TABLE `message_threads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `message_threads_collaboration_id_key` (`collaboration_id`);

--
-- Indexes for table `niches`
--
ALTER TABLE `niches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `niches_name_key` (`name`),
  ADD UNIQUE KEY `niches_slug_key` (`slug`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_fkey` (`user_id`);

--
-- Indexes for table `payouts`
--
ALTER TABLE `payouts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `platforms`
--
ALTER TABLE `platforms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `platforms_name_key` (`name`),
  ADD UNIQUE KEY `platforms_slug_key` (`slug`);

--
-- Indexes for table `platform_settings`
--
ALTER TABLE `platform_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `platform_settings_key_key` (`key`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reports_reporter_id_fkey` (`reporter_id`);

--
-- Indexes for table `review_queue_items`
--
ALTER TABLE `review_queue_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `saved_creators`
--
ALTER TABLE `saved_creators`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `saved_creators_advertiser_id_creator_user_id_key` (`advertiser_id`,`creator_user_id`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `team_members_advertiser_id_user_id_key` (`advertiser_id`,`user_id`),
  ADD KEY `team_members_user_id_fkey` (`user_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transactions_collaboration_id_fkey` (`collaboration_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wallets_owner_type_owner_id_key` (`owner_type`,`owner_id`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `advertiser_profiles`
--
ALTER TABLE `advertiser_profiles`
  ADD CONSTRAINT `advertiser_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_actor_id_fkey` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `campaigns`
--
ALTER TABLE `campaigns`
  ADD CONSTRAINT `campaigns_advertiser_id_fkey` FOREIGN KEY (`advertiser_id`) REFERENCES `advertiser_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `campaign_applications`
--
ALTER TABLE `campaign_applications`
  ADD CONSTRAINT `campaign_applications_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `campaign_applications_page_id_fkey` FOREIGN KEY (`page_id`) REFERENCES `creator_pages` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `campaign_assets`
--
ALTER TABLE `campaign_assets`
  ADD CONSTRAINT `campaign_assets_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `campaign_niches`
--
ALTER TABLE `campaign_niches`
  ADD CONSTRAINT `campaign_niches_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `campaign_niches_niche_id_fkey` FOREIGN KEY (`niche_id`) REFERENCES `niches` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `campaign_platforms`
--
ALTER TABLE `campaign_platforms`
  ADD CONSTRAINT `campaign_platforms_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `campaign_platforms_platform_id_fkey` FOREIGN KEY (`platform_id`) REFERENCES `platforms` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `campaign_targeting`
--
ALTER TABLE `campaign_targeting`
  ADD CONSTRAINT `campaign_targeting_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `collaborations`
--
ALTER TABLE `collaborations`
  ADD CONSTRAINT `collaborations_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `collaborations_page_id_fkey` FOREIGN KEY (`page_id`) REFERENCES `creator_pages` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `collaboration_content`
--
ALTER TABLE `collaboration_content`
  ADD CONSTRAINT `collaboration_content_collaboration_id_fkey` FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `collaboration_events`
--
ALTER TABLE `collaboration_events`
  ADD CONSTRAINT `collaboration_events_collaboration_id_fkey` FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `collaboration_invitations`
--
ALTER TABLE `collaboration_invitations`
  ADD CONSTRAINT `collaboration_invitations_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `collaboration_invitations_page_id_fkey` FOREIGN KEY (`page_id`) REFERENCES `creator_pages` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `collaboration_proofs`
--
ALTER TABLE `collaboration_proofs`
  ADD CONSTRAINT `collaboration_proofs_collaboration_id_fkey` FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `collaboration_review_feedback`
--
ALTER TABLE `collaboration_review_feedback`
  ADD CONSTRAINT `collaboration_review_feedback_collaboration_id_fkey` FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `creator_pages`
--
ALTER TABLE `creator_pages`
  ADD CONSTRAINT `creator_pages_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `creator_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `creator_pages_niche_id_fkey` FOREIGN KEY (`niche_id`) REFERENCES `niches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `creator_pages_platform_id_fkey` FOREIGN KEY (`platform_id`) REFERENCES `platforms` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `creator_page_niches`
--
ALTER TABLE `creator_page_niches`
  ADD CONSTRAINT `creator_page_niches_niche_id_fkey` FOREIGN KEY (`niche_id`) REFERENCES `niches` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `creator_page_niches_page_id_fkey` FOREIGN KEY (`page_id`) REFERENCES `creator_pages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `creator_profiles`
--
ALTER TABLE `creator_profiles`
  ADD CONSTRAINT `creator_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `disputes`
--
ALTER TABLE `disputes`
  ADD CONSTRAINT `disputes_collaboration_id_fkey` FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `disputes_raised_by_id_fkey` FOREIGN KEY (`raised_by_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_thread_id_fkey` FOREIGN KEY (`thread_id`) REFERENCES `message_threads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `message_threads`
--
ALTER TABLE `message_threads`
  ADD CONSTRAINT `message_threads_collaboration_id_fkey` FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_reporter_id_fkey` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `saved_creators`
--
ALTER TABLE `saved_creators`
  ADD CONSTRAINT `saved_creators_advertiser_id_fkey` FOREIGN KEY (`advertiser_id`) REFERENCES `advertiser_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `team_members`
--
ALTER TABLE `team_members`
  ADD CONSTRAINT `team_members_advertiser_id_fkey` FOREIGN KEY (`advertiser_id`) REFERENCES `advertiser_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `team_members_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_collaboration_id_fkey` FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
