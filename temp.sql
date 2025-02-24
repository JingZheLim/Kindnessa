-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: kindnessa
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `kindnessa`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `kindnessa` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `kindnessa`;

--
-- Table structure for table `Admins_Table`
--

DROP TABLE IF EXISTS `Admins_Table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admins_Table` (
  `user_id` int NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `Admins_Table_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admins_Table`
--

LOCK TABLES `Admins_Table` WRITE;
/*!40000 ALTER TABLE `Admins_Table` DISABLE KEYS */;
/*!40000 ALTER TABLE `Admins_Table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Email_Preferences`
--

DROP TABLE IF EXISTS `Email_Preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Email_Preferences` (
  `preference_id` int NOT NULL AUTO_INCREMENT,
  `post_notifications` tinyint(1) DEFAULT NULL,
  `event_notifications` tinyint(1) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `organisation_id` int DEFAULT NULL,
  PRIMARY KEY (`preference_id`),
  KEY `user_id` (`user_id`),
  KEY `organisation_id` (`organisation_id`),
  CONSTRAINT `Email_Preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Email_Preferences_ibfk_2` FOREIGN KEY (`organisation_id`) REFERENCES `Organisations` (`organisation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Email_Preferences`
--

LOCK TABLES `Email_Preferences` WRITE;
/*!40000 ALTER TABLE `Email_Preferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `Email_Preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Events`
--

DROP TABLE IF EXISTS `Events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `event_name` varchar(255) NOT NULL,
  `description` text,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `organisation_id` int DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `organisation_id` (`organisation_id`),
  CONSTRAINT `Events_ibfk_1` FOREIGN KEY (`organisation_id`) REFERENCES `Organisations` (`organisation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Events`
--

LOCK TABLES `Events` WRITE;
/*!40000 ALTER TABLE `Events` DISABLE KEYS */;
INSERT INTO `Events` VALUES (1,'Injured Paws','hello there',NULL,NULL,NULL,'../images/event_org-123_resized.jpg',123),(2,'Death','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporincididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitationullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit',NULL,NULL,NULL,'../images/event_org-123_resized.jpg',123),(3,'Helping Brook get a life','man brook is so sad she needs to touch grass',NULL,NULL,NULL,'../images/sniffing.png',126),(4,'yaline bday party','yaline house yayyy','2024-06-21','12:09:00','yaline undrer bed','../images/1718264550067-goofy ahh cat.jpg',124),(5,'i=mepw','meowmeowmeow','2024-06-21','12:03:00','meow','../images/1718268036001-goofy ahh cat.jpg',124);
/*!40000 ALTER TABLE `Events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Joined_Events`
--

DROP TABLE IF EXISTS `Joined_Events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Joined_Events` (
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`event_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `Joined_Events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Joined_Events_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `Events` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Joined_Events`
--

LOCK TABLES `Joined_Events` WRITE;
/*!40000 ALTER TABLE `Joined_Events` DISABLE KEYS */;
INSERT INTO `Joined_Events` VALUES (12344,1),(12344,2);
/*!40000 ALTER TABLE `Joined_Events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Joined_Organisations`
--

DROP TABLE IF EXISTS `Joined_Organisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Joined_Organisations` (
  `user_id` int NOT NULL,
  `organisation_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`organisation_id`),
  KEY `organisation_id` (`organisation_id`),
  CONSTRAINT `Joined_Organisations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Joined_Organisations_ibfk_2` FOREIGN KEY (`organisation_id`) REFERENCES `Organisations` (`organisation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Joined_Organisations`
--

LOCK TABLES `Joined_Organisations` WRITE;
/*!40000 ALTER TABLE `Joined_Organisations` DISABLE KEYS */;
INSERT INTO `Joined_Organisations` VALUES (12344,123),(12345,123);
/*!40000 ALTER TABLE `Joined_Organisations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Managers_Table`
--

DROP TABLE IF EXISTS `Managers_Table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Managers_Table` (
  `user_id` int NOT NULL,
  `organisation_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`organisation_id`),
  KEY `organisation_id` (`organisation_id`),
  CONSTRAINT `Managers_Table_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Managers_Table_ibfk_2` FOREIGN KEY (`organisation_id`) REFERENCES `Organisations` (`organisation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Managers_Table`
--

LOCK TABLES `Managers_Table` WRITE;
/*!40000 ALTER TABLE `Managers_Table` DISABLE KEYS */;
INSERT INTO `Managers_Table` VALUES (12344,123),(12345,123),(12345,124);
/*!40000 ALTER TABLE `Managers_Table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Organisations`
--

DROP TABLE IF EXISTS `Organisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Organisations` (
  `organisation_id` int NOT NULL AUTO_INCREMENT,
  `organisation_name` varchar(255) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`organisation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Organisations`
--

LOCK TABLES `Organisations` WRITE;
/*!40000 ALTER TABLE `Organisations` DISABLE KEYS */;
INSERT INTO `Organisations` VALUES (123,'organisation 1','hahahahahahahihihihhahahahahihhihhahahahahahihaihaihaihaih','../images/org1_resized.jpeg'),(124,'AVI','AVI exists to achieve community-determined development outcomes through the exchange of skills and knowledge by connecting people, organisations and communities, both within Australia and internationally.','../images/org2_resized.jpg'),(125,'IVHQ','At International Volunteer HQ, we bring people of more than 96 nationalities together to create positive transformation through regenerative travel. This transformation takes place not just within the communities we support, but also within volunteers themselves.','../images/org3.png'),(126,'Volunteer Friends','this is  dummy org','../images/org4_resized.png'),(127,'VSO','this is  dummy org','../images/org5_resized.png'),(128,'Love Volunteer','this is  dummy org','../images/org6_resized.png');
/*!40000 ALTER TABLE `Organisations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Posts`
--

DROP TABLE IF EXISTS `Posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text,
  `timestamp` datetime DEFAULT NULL,
  `visibility` enum('public','private') DEFAULT NULL,
  `organisation_id` int DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `organisation_id` (`organisation_id`),
  CONSTRAINT `Posts_ibfk_1` FOREIGN KEY (`organisation_id`) REFERENCES `Organisations` (`organisation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Posts`
--

LOCK TABLES `Posts` WRITE;
/*!40000 ALTER TABLE `Posts` DISABLE KEYS */;
INSERT INTO `Posts` VALUES (1,'Hey there',NULL,'SUPER AWESOME POST',NULL,NULL,NULL),(2,'Hey there2',NULL,'SUPER AWESOME POST2',NULL,NULL,NULL);
/*!40000 ALTER TABLE `Posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_Roles`
--

DROP TABLE IF EXISTS `User_Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_Roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role` enum('user','manager','admin') DEFAULT NULL,
  `organisation_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`role_id`),
  KEY `organisation_id` (`organisation_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `User_Roles_ibfk_1` FOREIGN KEY (`organisation_id`) REFERENCES `Organisations` (`organisation_id`),
  CONSTRAINT `User_Roles_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_Roles`
--

LOCK TABLES `User_Roles` WRITE;
/*!40000 ALTER TABLE `User_Roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `User_Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `given_name` varchar(255) DEFAULT NULL,
  `family_name` varchar(255) DEFAULT NULL,
  `role` enum('user','manager','admin') DEFAULT 'user',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12349 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (12344,'example@gmail.com','12345','hihi','haha','user'),(12345,'example2@gmail.com','$2b$10$V6hXQAo2lN0SbEL7CCnBbe4vfXDRgwPf9UEu0.R2xG095035ZKoTe',NULL,NULL,'manager'),(12346,'example3@gmail.com','$2b$10$T5r3q2tqcsgYChpqCw03jehP3r/QofqPmhv30VwNqX7P5u/0xIyIK',NULL,NULL,'admin'),(12347,'isniffcats@gmail.com','$2b$10$Am8eeth2LyrYD7DjaDWfVOZ3GDItkKGC.BwRgdJHEuUB0CiwICcby',NULL,NULL,'user'),(12348,'yaline@gmail.com','$2b$10$.3Cwpo3GDrm02CeXhSa4yuYZ4OuPeLXbAOiriA3PDb4lfPnnAAt1a','Yaline','Dong','user');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users_Table`
--

DROP TABLE IF EXISTS `Users_Table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users_Table` (
  `user_id` int NOT NULL,
  `organisation_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`organisation_id`),
  KEY `organisation_id` (`organisation_id`),
  CONSTRAINT `Users_Table_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Users_Table_ibfk_2` FOREIGN KEY (`organisation_id`) REFERENCES `Organisations` (`organisation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users_Table`
--

LOCK TABLES `Users_Table` WRITE;
/*!40000 ALTER TABLE `Users_Table` DISABLE KEYS */;
/*!40000 ALTER TABLE `Users_Table` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-13  9:10:40
