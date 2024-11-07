-- Dominic Fantauzzo


-- for cli reference:
--      mysql -u cs361_fantauzd -h classmysql.engr.oregonstate.edu -p



SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema cs361_fantauzd
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema cs361_fantauzd
-- -----------------------------------------------------
-- CREATE SCHEMA IF NOT EXISTS `cs340_fantauzd` DEFAULT CHARACTER SET utf8 ;

-- -----------------------------------------------------
-- Table `shelters`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Shelters` (
  `shelter_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NOT NULL,
  `street_address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(255) NOT NULL,
  `postal_code` VARCHAR(255) NOT NULL,
  `state` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`shelter_id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;

INSERT INTO Shelters (name, email, phone, street_address, city, postal_code, state)
VALUES
	('West Valley Humane Society', 'westvalleyhumanesociety@gmail.com', '941 234 2352', '5234 Johnston Way', 'Sarasota', '34344', 'FL'),
    ('Hand and Paw', 'handandpaw@outlook.com', '942 234 2345', '5214 Citrus Way', 'Orlando', '34243', 'ID'),
    ('Lake Lowell Animal Rescue', 'lakelowellanimal@gmail.com', '912 246 6469', '455 Lowell Street', 'Tampa', '34554', 'FL');

-- -----------------------------------------------------
-- Table `pets`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Pets` (
  `pet_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `species` VARCHAR(255) NOT NULL,
  `breed` VARCHAR(255) NOT NULL,
  `birthdate` DATE NOT NULL,
  `size` VARCHAR(255) NOT NULL,
  `description` VARCHAR(600) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `shelter_id` INT NOT NULL,
  INDEX `fk_pets_Shelter1_idx` (`shelter_id` ASC) VISIBLE,
  PRIMARY KEY (`pet_id`),
  CONSTRAINT `fk_pets_Shelter1`
    FOREIGN KEY (`shelter_id`)
    REFERENCES `Shelters` (`shelter_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- INSERT INTO Pets (name, species, breed, birthdate, size, description, filename, shelter_id)
-- VALUES
-- (
--     'Moose', 
--     'Dog', 
--     'Mutt', 
--     '2016-01-24', 
--     'Large', 
--     'Meet Moose, the scruffy mutt with a heart as warm as his cocoa-brown coat! This handsome fellow is a true mix of everything lovable in a dog. \
--     Moose is a medium-sized dog with a shaggy, thick coat that’s mostly a warm brown color, adding to his unique charm. His soulful, deep-brown eyes shine with intelligence and curiosity, \
--     and his slightly floppy ears perk up whenever he hears a friendly voice or the jingling of a leash. Moose is the kind of dog who is eager to join you for a walk around the neighborhood \
--     or a cozy nap on the couch.', 
--     LOAD_FILE('C:/Users/domin/OneDrive/Pictures/Moose.jpg'), 
--     1
-- );

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `street_address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(255) NOT NULL,
  `postal_code` VARCHAR(255) NOT NULL,
  `state` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `matches`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Matches` (
  `match_id` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `user_id` INT NOT NULL,
  `pet_id` INT NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`match_id`),
  INDEX `fk_matches_users1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_matches_pets1_idx` (`pet_id` ASC) VISIBLE,
  CONSTRAINT `fk_matches_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_matches_pets1`
    FOREIGN KEY (`pet_id`)
    REFERENCES `Pets` (`pet_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
