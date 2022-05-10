insert into users (user_id, user_name, user_contact) values 
('593b2e0a-efb6-4935-968c-162d2e38802e', 'abror', '998330060523'),
('973e3205-9a7f-4166-b22c-806f29be3f68', 'diyor', '998996947967'),
('0ddbb21e-5f7e-4de0-9728-0729c15a4959', 'abdurahmon', '998977101030');

insert into foods (food_id, food_name, food_img, food_price) values
('f5f0ac18-6ccb-459d-94af-eb53650097f5', 'Cola', 'cola.jpeg', 11000),
('cfdc54d5-aec8-46b4-aaf8-42807a528132', 'Spinner', 'spinner.jpeg', 16000),
('09d3da9a-90a4-4409-899a-5036faf31550', 'Chiken Wings', 'chicken_wings.jpeg', 25000),
('6093f6fa-931c-4bce-83d4-11161e258721', 'Burger Cheese', 'burger_cheese.jpeg', 18000),
('51fbed46-90b2-4f17-bcdb-adc28286f5d1', 'Chicken Togora', 'chicken_togora.jpeg', 95000),
('63a5d003-9b46-48ae-8c8b-c522822e8805', 'Combo', 'combo.jpeg', 35000),
('fe2c62bd-c3cb-4d67-86c5-9f2006cf860b', 'Fanta', 'fanta.jpeg', 11000);

insert into orders (user_id, food_id, order_count) values
('593b2e0a-efb6-4935-968c-162d2e38802e', 'f5f0ac18-6ccb-459d-94af-eb53650097f5', 1),
('593b2e0a-efb6-4935-968c-162d2e38802e', '6093f6fa-931c-4bce-83d4-11161e258721', 1),
('973e3205-9a7f-4166-b22c-806f29be3f68', '51fbed46-90b2-4f17-bcdb-adc28286f5d1', 1),
('973e3205-9a7f-4166-b22c-806f29be3f68', 'fe2c62bd-c3cb-4d67-86c5-9f2006cf860b', 2),
('0ddbb21e-5f7e-4de0-9728-0729c15a4959', '09d3da9a-90a4-4409-899a-5036faf31550', 1);
