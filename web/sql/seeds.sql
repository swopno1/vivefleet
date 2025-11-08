insert into users (name, email, role) values ('Md Amir Hossain','amirhossain.limon@gmail.com','admin');

insert into users (name, email, role) values ('Driver One','test.vivescriptsolutions@gmail.com','driver');

insert into vehicles (name, driver_id) values ('Truck-001', (select id from users where email='test.vivescriptsolutions@gmail.com'));