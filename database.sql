CREATE TABLE hpcl_users(
    user_id uuid INTEGER PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_role VARCHAR(255) DEFAULT 'watcher',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO hpcl_users (user_name, user_email, user_password) VALUES ('prasad', 'prasad@gmail.com', 'p123');

UPDATE hpcl_users SET user_role = 'scheduler' WHERE user_name = 'hpcl';  

DELETE FROM hpcl_users  WHERE user_id = 4; 


/* ----------------------------------------------------------------------------------------------------------------------------- */

CREATE TABLE hpcl_user_access_matrix (
    id NUMBER GENERATED BY DEFAULT AS IDENTITY,
    user_role VARCHAR2(20),
    schedule NUMBER(1) DEFAULT 0,
    visualisation NUMBER(1) DEFAULT 0,
    master_data NUMBER(1) DEFAULT 0,
    PRIMARY KEY (id)
);

INSERT INTO hpcl_user_access_matrix (user_role, schedule, visualisation, master_data)
VALUES ('admin', 1, 1, 1);

select * from hpcl_user_access_matrix;

ALTER TABLE hpcl_user_access_matrix
ADD new_link_name NUMBER(1) DEFAULT 0;

UPDATE hpcl_user_access_matrix
SET new_link_name = 1
WHERE user_role = 'admin';
