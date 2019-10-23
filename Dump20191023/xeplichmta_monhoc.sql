-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: xeplichmta
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `monhoc`
--

DROP TABLE IF EXISTS `monhoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monhoc` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mamonhoc` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `sotinchi` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monhoc`
--

LOCK TABLES `monhoc` WRITE;
/*!40000 ALTER TABLE `monhoc` DISABLE KEYS */;
INSERT INTO `monhoc` VALUES (1,'12261151','Xử lý tín hiệu số(CNTT)',3,'2019-08-01 10:07:51'),(2,'12227151','Trí tuệ nhân tạo',3,'2019-08-01 10:08:23'),(3,'12288151','Trí tuệ nhân tạo nâng cao',3,'2019-08-01 10:08:41'),(4,'12564151','Thiết kế giao diện người sử dụng',3,'2019-08-01 10:09:04'),(5,'12567151','Thực tập kỹ thuật lập trình',3,'2019-08-01 10:09:24'),(6,'12272151','Phát triển trò chơi trực tuyến',3,'2019-08-01 10:09:43'),(7,'12325151','Phân tích thiết kế giải thuật',3,'2019-08-01 10:10:02'),(8,'12571151','Phát triển phần mềm di động',3,'2019-08-01 10:10:30'),(9,'12382151','Phát triển hệ thống quản trị doanh nghiệp',3,'2019-08-01 10:12:14'),(10,'12364151','Lập trình trò chơi và mô phỏng',3,'2019-08-01 10:13:03'),(11,'12500151','Lập trình cơ bản',3,'2019-08-01 10:13:51'),(12,'12556151','Lập trình nâng cao',3,'2019-08-01 10:14:23'),(13,'12322151','Đảm bảo an toàn thông tin',3,'2019-08-01 10:14:47'),(14,'12461151','An ninh mạng',3,'2019-08-01 10:15:05'),(15,'12260151','Công nghệ đa phương tiện',3,'2019-08-01 10:15:53'),(16,'12423151','Cộng nghệ lập trình tích hợp',3,'2019-08-01 10:16:11'),(17,'12374151','Công nghệ web nâng cao',3,'2019-08-01 10:18:38'),(18,'12377151','Cơ bản về điện toán đám mây',3,'2019-08-01 10:22:12'),(19,'12359151','Cơ sở dữ liệu nâng cao',3,'2019-08-01 10:24:53'),(20,'12321151','Cơ sở dữ liệu',4,'2019-08-02 10:25:34'),(21,'12529151','Chuyên đề nâng cao lập trình các cấu trúc dữ liệu',2,'2019-08-02 10:27:44'),(22,'12525151','Kỹ thuật lập trình',3,'2019-08-02 10:35:11'),(23,'12226151','Lý thuyết hệ điều hành',3,'2019-08-02 07:29:07'),(24,'12480151','Quản trị mạng',2,'2019-08-02 07:29:28'),(25,'12471151','Lập trình mạng',2,'2019-08-02 07:30:10'),(26,'12523151','Phương pháp nguyên cưu IT',2,'2019-08-02 07:31:28'),(27,'COMP 497','Thực tập công nghệ 1',2,'2019-08-02 07:32:02'),(28,'COMP 497','Thực tập công nghệ',4,'2019-08-02 08:41:39'),(29,'12264151','Công nghệ XML và web ngữ nghĩa',3,'2019-08-02 08:41:39'),(30,'12565151','Khai phá dữ liệu',3,'2019-10-23 14:18:00'),(31,'12375151','Nhập môn cơ sở dữ liệu lớn',3,'2019-10-23 14:19:29'),(32,'12225151','Đồ Họa Máy Tính',3,'2019-10-23 14:24:45'),(33,'12361151','Phân tích và thiết kế hệ thống',3,'2019-10-23 14:28:20'),(34,'12273151','Thiết kế trò chơi số',3,'2019-10-23 14:29:04'),(35,'12466151','Thương mại điện tử',3,'2019-10-23 14:29:46'),(36,'12474151','Đánh giá an ninh mạng',3,'2019-10-23 14:30:58'),(37,'12559151','Phân tích và mô hình hóa phần mềm',3,'2019-10-23 14:35:29'),(38,'12561151','Thiết kế và xây dựng phần mềm',3,'2019-10-23 14:36:47'),(39,'12562151','Đánh giá chất lượng phần mềm',3,'2019-10-23 14:37:27'),(40,'12558151','Công nghệ Cilent/Server',3,'2019-10-23 14:50:12');
/*!40000 ALTER TABLE `monhoc` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-23 22:57:04
