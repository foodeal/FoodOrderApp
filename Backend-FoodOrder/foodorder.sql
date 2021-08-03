-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: foodorder
-- ------------------------------------------------------
-- Server version	8.0.18

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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `logging_time` datetime DEFAULT NULL,
  `accessToken` varchar(255) DEFAULT NULL,
  `refreshToken` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Foodealz','Admin','Administrateur','hello@foodealz.com','77817b6360c5d6ff1f2a32f992cff4c63202399b','2021-06-23 09:50:15','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiRm9vZGVhbHoiLCJsYXN0TmFtZSI6IkFkbWluIiwieHNyZlRva2VuIjoiYjFjMjBlNjAxMjU5MmVjZjM2ZDZiZmExNjI5MWQxOGJkZWQ1M2IwOTFlNGZlZTk3MzdiNmQ4MWEwNzAyNDM2ZDUwNzYwNzdiMDkyNjAzNGUwODBkZDQ2NTIyMmMxZmM0MmQ3OD','ocy+F/pAwHaELokqzpJvvrSJngzE0kF3SomellhDaLzhXqcybvzCYxF9wTe1ps/KBQe8bSuRRO5sJBMzcaBk3V/i8axDVmjd/qLa85JXkt/GtnhYUN5/MXkW0Pdyl6dwfVSwhry6uZ7q7UI+eGYwzbEI6fT10lWzBbCvyqypEr4=','2021-04-30 09:06:43','2021-06-23 09:50:15'),(3,NULL,NULL,'administrateur','administrateur@foodealz.com','eec2b31957b4e5346a2ebe4ae02498534462db18',NULL,NULL,NULL,'2021-05-21 11:11:27','2021-05-21 11:11:27');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingdeals`
--

DROP TABLE IF EXISTS `billingdeals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingdeals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commission_rate` double DEFAULT NULL,
  `Price` double DEFAULT NULL,
  `money_due` double DEFAULT NULL,
  `error_pourcentage` double DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `monthlubilling_id` int(11) DEFAULT NULL,
  `coupon_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `monthlubilling_id` (`monthlubilling_id`),
  KEY `coupon_id` (`coupon_id`),
  CONSTRAINT `billingdeals_ibfk_1` FOREIGN KEY (`monthlubilling_id`) REFERENCES `monthlybillings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `billingdeals_ibfk_2` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`coupon_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingdeals`
--

LOCK TABLES `billingdeals` WRITE;
/*!40000 ALTER TABLE `billingdeals` DISABLE KEYS */;
/*!40000 ALTER TABLE `billingdeals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookcoupons`
--

DROP TABLE IF EXISTS `bookcoupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookcoupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coupon_date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `dealScheduled_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dealScheduled_id` (`dealScheduled_id`),
  CONSTRAINT `bookcoupons_ibfk_1` FOREIGN KEY (`dealScheduled_id`) REFERENCES `deal_scheduleds` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookcoupons`
--

LOCK TABLES `bookcoupons` WRITE;
/*!40000 ALTER TABLE `bookcoupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookcoupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon_histories`
--

DROP TABLE IF EXISTS `coupon_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon_histories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `coupon_histories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon_histories`
--

LOCK TABLES `coupon_histories` WRITE;
/*!40000 ALTER TABLE `coupon_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupon_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `coupon_id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `PriceAfterDiscount` double DEFAULT NULL,
  `earned_money` double DEFAULT NULL,
  `status_user` varchar(255) DEFAULT NULL,
  `status_restaurant` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `nbre_coupons` int(11) DEFAULT NULL,
  `payement` varchar(255) DEFAULT NULL,
  `noter` tinyint(1) DEFAULT NULL,
  `foodQR` varchar(255) DEFAULT NULL,
  `reduce` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  `dealScheduled_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`coupon_id`),
  KEY `user_id` (`user_id`),
  KEY `restaurant_id` (`restaurant_id`),
  KEY `dealScheduled_id` (`dealScheduled_id`),
  CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_2` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_3` FOREIGN KEY (`dealScheduled_id`) REFERENCES `deal_scheduleds` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deal_scheduleds`
--

DROP TABLE IF EXISTS `deal_scheduleds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deal_scheduleds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quantity` int(11) DEFAULT NULL,
  `nbre_redeemed_deal` int(11) DEFAULT NULL,
  `startingdate` datetime DEFAULT NULL,
  `expirydate` datetime DEFAULT NULL,
  `startingdate_hours` varchar(255) DEFAULT NULL,
  `expirydate_hours` varchar(255) DEFAULT NULL,
  `active` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  `deal_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `restaurant_id` (`restaurant_id`),
  KEY `deal_id` (`deal_id`),
  CONSTRAINT `deal_scheduleds_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `deal_scheduleds_ibfk_2` FOREIGN KEY (`deal_id`) REFERENCES `deals` (`deal_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deal_scheduleds`
--

LOCK TABLES `deal_scheduleds` WRITE;
/*!40000 ALTER TABLE `deal_scheduleds` DISABLE KEYS */;
INSERT INTO `deal_scheduleds` VALUES (1,50,0,'2021-07-26 12:00:00','2021-07-26 19:00:00','14:00','21:00','inactive','2021-06-23 10:24:32','2021-07-26 09:36:09',1,1),(2,50,0,'2021-07-26 12:00:00','2021-07-26 19:00:00','14:00','21:00','active','2021-06-23 10:40:40','2021-07-26 09:36:09',1,2);
/*!40000 ALTER TABLE `deal_scheduleds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deals`
--

DROP TABLE IF EXISTS `deals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deals` (
  `deal_id` int(11) NOT NULL AUTO_INCREMENT,
  `imageurl` varchar(255) DEFAULT NULL,
  `discount` varchar(255) DEFAULT NULL,
  `PriceAfterDiscount` double DEFAULT NULL,
  `PriceBeforeDiscount` double DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `deal_description` varchar(255) DEFAULT NULL,
  `startingdate` datetime DEFAULT NULL,
  `expirydate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`deal_id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `deals_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deals`
--

LOCK TABLES `deals` WRITE;
/*!40000 ALTER TABLE `deals` DISABLE KEYS */;
INSERT INTO `deals` VALUES (1,'http://res.cloudinary.com/da8pq7gcb/image/upload/v1624442193/ablahorchi/wipan8fdtbtwgzdyfj6p.jpg','50%',7.5,15,'Rice pilaf','Pilaf is a method of cooking rice from the Middle East and Central Asia, in which the grain, such as rice, crushed wheat, or quinoa, is usually seared in oil and sweaty onions. chopped, before being cooked in the oven or in a casserole dish with 1.5 times','2021-06-23 12:00:00','2021-12-31 20:00:00','2021-06-23 10:24:32','2021-06-23 10:24:32',1),(2,'http://res.cloudinary.com/da8pq7gcb/image/upload/v1624442193/ablahorchi/wipan8fdtbtwgzdyfj6p.jpg','50%',7.5,15,'Rice pilaf','Pilaf is a method of cooking rice from the Middle East and Central Asia, in which the grain, such as rice, crushed wheat, or quinoa, is usually seared in oil and sweaty onions. chopped, before being cooked in the oven or in a casserole dish with 1.5 times','2021-06-23 12:00:00','2021-12-31 20:00:00','2021-06-23 10:40:40','2021-06-23 10:40:40',1);
/*!40000 ALTER TABLE `deals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dealtemps`
--

DROP TABLE IF EXISTS `dealtemps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dealtemps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discount` varchar(255) DEFAULT NULL,
  `PriceAfterDiscount` double DEFAULT NULL,
  `PriceBeforeDiscount` double DEFAULT NULL,
  `imageurl` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `startingdate` datetime DEFAULT NULL,
  `expirydate` datetime DEFAULT NULL,
  `pack_deal` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dealtemps`
--

LOCK TABLES `dealtemps` WRITE;
/*!40000 ALTER TABLE `dealtemps` DISABLE KEYS */;
/*!40000 ALTER TABLE `dealtemps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invendus`
--

DROP TABLE IF EXISTS `invendus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invendus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `PriceBeforeDiscount` double DEFAULT NULL,
  `PriceAfterDiscoun` double DEFAULT NULL,
  `discount` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `invendus_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invendus`
--

LOCK TABLES `invendus` WRITE;
/*!40000 ALTER TABLE `invendus` DISABLE KEYS */;
INSERT INTO `invendus` VALUES (1,'Rice pilaf','http://res.cloudinary.com/da8pq7gcb/image/upload/v1624442193/ablahorchi/wipan8fdtbtwgzdyfj6p.jpg',15,7.5,'50%','Pilaf is a method of cooking rice from the Middle East and Central Asia, in which the grain, such as rice, crushed wheat, or quinoa, is usually seared in oil and sweaty onions. chopped, before being cooked in the oven or in a casserole dish with 1.5 times','2021-06-23 10:04:18','2021-06-23 10:04:18',1);
/*!40000 ALTER TABLE `invendus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Date` datetime DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,NULL,12.971598699999973,77.59456269999998,'Srinagar bus stop Bangalore, IBM India Pvt Ltd D3 Block, Vittal Mallya Rd, HSR Layout, KG Halli, D\' Souza Layout, Ashok Nagar, Bengaluru, Karnataka 560001, India','2021-06-23 10:48:15','2021-06-23 10:48:15',NULL),(2,NULL,22.57264599999995,88.36389499999996,'24, Ramakanta Mistri Ln, Cossipore, Newland, College Square, Kolkata, West Bengal 700073, India','2021-06-23 10:49:19','2021-06-23 10:49:19',NULL),(3,NULL,36.854995599999995,10.254816200000022,'Les Jardins de l\'Aouina, Tunisia','2021-06-25 10:44:44','2021-06-25 10:44:44',NULL),(4,NULL,36.854995599999995,10.254816200000022,'Les Jardins de l\'Aouina, Tunisia','2021-06-25 10:44:53','2021-06-25 10:44:53',NULL),(5,NULL,15.849695299999965,74.49767410000015,'Hirekodi, Velguem, Camp, Belagavi, Karnataka, India','2021-06-25 10:46:08','2021-06-25 10:46:08',NULL),(6,NULL,15.857375242985242,74.49425994210083,'Belagavi, Karnataka 590001, India','2021-06-25 10:46:49','2021-06-25 10:46:49',NULL),(7,NULL,22.57264599999995,88.36389499999996,'24, Ramakanta Mistri Ln, Cossipore, Newland, College Square, Kolkata, West Bengal 700073, India','2021-06-25 10:49:57','2021-06-25 10:49:57',NULL),(8,NULL,22.57264599999995,88.36389499999996,'24, Ramakanta Mistri Ln, Cossipore, Newland, College Square, Kolkata, West Bengal 700073, India','2021-06-25 10:49:57','2021-06-25 10:49:57',NULL),(9,NULL,22.572646000000006,88.36389499999996,'24, Ramakanta Mistri Ln, Cossipore, Newland, College Square, Kolkata, West Bengal 700073, India','2021-06-25 11:22:46','2021-06-25 11:22:46',1),(10,NULL,36.85578466955863,10.26786368741665,'El Aouina, Tunis, Tunisia','2021-06-25 11:39:25','2021-06-25 11:39:25',1),(11,NULL,13.035355699999982,77.59878740000005,'Unnamed Road, Thimakka Layout, Coconut Garden, Cholanayakanahalli, Hebbal, Bengaluru, Karnataka 560032, India','2021-07-26 09:38:47','2021-07-26 09:38:47',1);
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monthlybillings`
--

DROP TABLE IF EXISTS `monthlybillings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monthlybillings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `monthly_invoice` double DEFAULT NULL,
  `month` varchar(255) DEFAULT NULL,
  `year` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `monthlybillings_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monthlybillings`
--

LOCK TABLES `monthlybillings` WRITE;
/*!40000 ALTER TABLE `monthlybillings` DISABLE KEYS */;
/*!40000 ALTER TABLE `monthlybillings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserved_deals`
--

DROP TABLE IF EXISTS `reserved_deals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserved_deals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` varchar(255) DEFAULT NULL,
  `nbre_coupons` int(11) DEFAULT NULL,
  `payement` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `PriceAfterDiscount` double DEFAULT NULL,
  `earned_money` double DEFAULT NULL,
  `timepickup` datetime DEFAULT NULL,
  `motif` varchar(255) DEFAULT NULL,
  `foodQR` varchar(255) DEFAULT NULL,
  `reduce` tinyint(1) DEFAULT NULL,
  `commission_rate` double DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `deal_scheduled_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `restaurant_id` (`restaurant_id`),
  KEY `user_id` (`user_id`),
  KEY `deal_scheduled_id` (`deal_scheduled_id`),
  CONSTRAINT `reserved_deals_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `reserved_deals_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `reserved_deals_ibfk_3` FOREIGN KEY (`deal_scheduled_id`) REFERENCES `deal_scheduleds` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserved_deals`
--

LOCK TABLES `reserved_deals` WRITE;
/*!40000 ALTER TABLE `reserved_deals` DISABLE KEYS */;
INSERT INTO `reserved_deals` VALUES (1,NULL,1,'Sur place','expire',7.5,7.5,'2021-06-25 10:56:44','Panier expiré','foodr-e3af4f4e02c14da7ae1f7902f717372ad671fae3e650b66fba79f77966baf0e5',0,0.1,'2021-06-25 10:56:45','2021-07-26 09:38:57',1,1,2);
/*!40000 ALTER TABLE `reserved_deals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurants` (
  `restaurant_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `typePayment` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `phone` int(11) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `OnesignalId` varchar(255) DEFAULT NULL,
  `commission_rate` double DEFAULT NULL,
  `logourl` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `accessToken` varchar(255) DEFAULT NULL,
  `refreshToken` varchar(255) DEFAULT NULL,
  `startinghours` varchar(255) DEFAULT NULL,
  `expiryhours` varchar(255) DEFAULT NULL,
  `discount` varchar(255) DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`restaurant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,'Partner1','Partner1@gmail.com','ba55f3e0f0563b18bf42df9fae8259b4d5197994',NULL,'This is the best food place','3 no, Mali Bagan, Motilal Colony, Poodar Vihar, Dum Dum, Kolkata, West Bengal 700081, India','www.Partner1.com',2147483647,22.6293867,88.4354486,'restaurant','fe62d8fb-70d7-4468-ba8c-074c3381c8bc,91d08559-e5e2-47ce-8eeb-564e757ea4f6',0.1,'http://res.cloudinary.com/da8pq7gcb/image/upload/v1624442139/ablahorchi/l3etofx2qoanaqapv62d.png','http://res.cloudinary.com/da8pq7gcb/image/upload/v1624442193/ablahorchi/wipan8fdtbtwgzdyfj6p.jpg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlBhcnRuZXIxIiwibWFpbCI6IlBhcnRuZXIxQGdtYWlsLmNvbSIsInhzcmZUb2tlbiI6IjczNDgyNzVlZmQ3MmI0MWYwN2Y5YzcwOGZlYzM3YWE0YzE4YTgwZmY1ZjRiNzZhZGJlMmZlNmY1YzE1OGFlMTY4ZDRkMWEwMTk5YTliYTMxZDg4NzJlMTBhMjNiZTEwZG','y7aO7XjUrR6A0xB9bG6BBLGqPasjn+tn8Mn7z9pES7n4GaAL6bv9iLO5xFMRdELEMokIZ/oiBtWx2fIa6yO4QDQMpitBSpzWEgIjVqLlXObaNyAvPZ45TEnkjQpfB/XepyFQURfkmmSgOmtApkvJZwdh7poEHlfy8XAUks/KliY=','14:00','21:00','',NULL,'2021-06-23 09:56:58','2021-06-25 13:52:32');
/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_restau_preferences`
--

DROP TABLE IF EXISTS `user_restau_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_restau_preferences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `user_restau_preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `user_restau_preferences_ibfk_2` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_restau_preferences`
--

LOCK TABLES `user_restau_preferences` WRITE;
/*!40000 ALTER TABLE `user_restau_preferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_restau_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `reset` tinyint(1) DEFAULT NULL,
  `new` tinyint(1) DEFAULT NULL,
  `id` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `OnesignalId` varchar(255) DEFAULT NULL,
  `active` varchar(255) DEFAULT NULL,
  `vcode` varchar(255) DEFAULT NULL,
  `dcode` varchar(255) DEFAULT NULL,
  `accessToken` varchar(255) DEFAULT NULL,
  `refreshToken` varchar(255) DEFAULT NULL,
  `birthday` datetime DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `logging_time` datetime DEFAULT NULL,
  `phone` int(11) DEFAULT NULL,
  `pays` varchar(255) DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `sexe` varchar(255) DEFAULT NULL,
  `hearAboutUs` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,NULL,'Test@test.com','901199733432321576d65e5f9cea1420e757ac9c',0,0,NULL,NULL,'test','66e816d8-93ed-4556-951c-b565ee809964','active',NULL,'9832','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjpudWxsLCJsYXN0TmFtZSI6bnVsbCwieHNyZlRva2VuIjoiZDExMzA2N2ZiMGQwMzljOWViM2Y1ZjIxYmFlMjg3YmZhMjE5YmU2OWFkODExNzdiODM5ZDAwNjJkNzNmYTc1ODYwNGExOTA0MDE0MTVhOGJmMTBjOGY2ODIzYWJhYWJiZDExYjI0NzA2ODMxOD','ST8pDAGZj+44M6CTDXS5YFgun87+O2ToazbiiP53ilFiJ2mUi4qQ5mX9B8AC2mDaTo4KlJrkW2//fhvOUJkcKbie2SbdB33lGrDNzhg+siELz2GfqeQSAIfDtid9mPjub0rKUCaty6ViCaqoQzF99fG2VAAdoPOjZH84gHkR2uA=','0000-00-00 00:00:00',12,'2021-06-25 11:22:25',0,NULL,NULL,'Man','Friend','2021-06-25 10:51:41','2021-07-26 09:43:59');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-03 11:44:15
