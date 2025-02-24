For this project our group used the multiple organisation approach to create our website

# (/-o-)/ Kindnessa
Welcome to Kindnessa, the official website of the greatest volunteering platform dedicated to fostering community and creating meaningful volunteering experiences!

At Kindnessa, we believe in the transformative power of volunteering. We hope to connect passionate volunteers with meaningful opportunities across Australia, empowering individuals and communities to thrive.

Whether you aim to support local organizations, contribute to community development, or foster cultural exchange, Kindnessa is your gateway to making a difference. Join us in spreading kindness, one act at a time, and be a part of a vibrant network dedicated to creating positive change.

Together, we can build a more compassionate and connected world!

# (>^-^)> Setting it up!
The necessary libraries to be installed are outlined in package.json
Make sure to install mysql so the web application functions as intented

``npm install --save mysql``   --> For using the database (kindnessa.sql)
``npm install bcrypt``         --> Library for hashing password
``npm install --save multer``  --> For uploading files

**After installing the relevant libraries**
**Enter the commands below in the terminal to get the database and server up and running**

``service mysql start``
``mysql < database/kindnessa.sql``
``npm start``

# At this point, you should get a message stating: <(^-^<)
Database Connected!

When you visit our site, you'll land on our homepage. From there, you have the option to explore our web application as a guest or log in with specific roles like admin, manager, or user. Each role grants different functionalities and permissions tailored to your needs.

__Admin Details__
**Email**: admin@gmail.com
**Password**: admin

__Manager Details__
**Email**: example2@gmail.com
**Password**: 123456

__User Details__
**Email**: catlover123@gmail.com
**Password**: meow123

## Video Demonstration \(^o^)/
Linked here is the video demonstration:
https://drive.google.com/file/d/1V3GGNfK99gGA1edQy5SUn8imxPO5G8Bs/view?usp=sharing


