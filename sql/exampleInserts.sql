\c request_bin

INSERT INTO bins(url, ip_address) VALUES 
('www.com', '0.0.0.127'),
('www.epofallon.com', '1.2.43.556.0'),
('www.nino.com', '1.2.3.5555.33');

INSERT INTO requests(mongo_id, bin_id) VALUES
(1, '123456'),
(1, '234567'),
(1, '345678'),
(2, '9876'),
(2, '1'),
(3, '4');