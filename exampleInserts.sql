\c request_bin

INSERT INTO bins(url, ip_address) VALUES 
('www.com', '0.0.0.127'),
('www.epofallon.com', '1.2.43.556.0'),
('www.nino.com', '1.2.3.5555.33');

INSERT INTO requests(bin_id, mongo_id, method, headers) VALUES
(1, '123456', 'POST', 'Content-type: Application-json'),
(1, '234567', 'POST', 'Content-type: Application-json'),
(1, '345678', 'POST', 'Content-type: Application-json'),
(2, '9876', 'POST', 'Content-type: Application-json'),
(2, '1', 'POST', 'Content-type: Application-json'),
(3, '4', 'POST', 'Content-type: Application-json');