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
-- Table structure for table `phanconggiangday`
--

DROP TABLE IF EXISTS `phanconggiangday`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phanconggiangday` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idmonhoc` int(11) DEFAULT NULL,
  `idgiangvien` int(11) DEFAULT NULL,
  `idlop` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phanconggiangday`
--

LOCK TABLES `phanconggiangday` WRITE;
/*!40000 ALTER TABLE `phanconggiangday` DISABLE KEYS */;
INSERT INTO `phanconggiangday` VALUES (1,1,1,10,'2019-04-23 10:31:34'),(7,3,6,1,'2019-04-23 10:32:54'),(11,4,6,1,'2019-04-23 10:33:55'),(16,6,6,1,'2019-04-23 10:37:13'),(18,7,9,7,'2019-04-23 10:37:39'),(19,7,7,9,'2019-04-23 10:37:51'),(20,7,7,10,'2019-04-23 10:38:02'),(48,10,16,10,'2019-04-23 19:02:10'),(73,19,9,7,'2019-10-23 13:57:11'),(74,29,6,1,'2019-10-23 14:00:46'),(75,29,6,5,'2019-10-23 14:01:06'),(76,30,27,5,'2019-10-23 14:18:57'),(77,31,28,5,'2019-10-23 14:20:12'),(78,6,6,1,'2019-10-23 14:23:03'),(79,15,29,1,'2019-10-23 14:23:37'),(80,32,30,10,'2019-10-23 14:25:25'),(81,18,28,9,'2019-10-23 14:33:27'),(82,40,27,2,'2019-10-23 14:54:56'),(83,8,31,2,'2019-10-23 14:55:20'),(84,19,9,2,'2019-10-23 14:56:09');
/*!40000 ALTER TABLE `phanconggiangday` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-23 22:57:03
