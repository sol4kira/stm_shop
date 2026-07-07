USE stm_shop;

CREATE TABLE customer(
    customerId          int primary key ,
    customerName        varchar(20) not null,
    customerPhoneNumber varchar(20) not null
);

CREATE TABLE supplier(
    supplierId          int primary key auto_increment,
    supplierName        varchar(20) not null,
    supplierPhoneNumber varchar(20) not null
);

CREATE TABLE  product(
    productId              int primary key,
    productName            varchar(100) not null,
    productPurchasingPrice decimal(10,2) not null,
    productSellingPrice    decimal(10,2) not null,
    color                  char(20),
    productType            varchar(100) not null,
    productQuantity        int not null,
    productDescription     varchar(100)not null
);

CREATE TABLE sale(
    saleId           int primary key auto_increment,
    saleDate         datetime not null default current_timestamp,
    saleTotalAmount  decimal(10,2) not null,
    customerId       INT NOT NULL,
    FOREIGN KEY (customerId) REFERENCES customer(customerId)
);

CREATE TABLE sale_item(
    saleItemId     int primary key auto_increment,
    salePrice      decimal(10,2) not null,
    quantity       Int not null,
    ProductId      INT NOT NULL,
    saleId         INT NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES product(productId),
    FOREIGN KEY (saleId) REFERENCES sale(saleId)
);

CREATE TABLE sale_payment(
    salePaymentId     int primary key,
    salePaymentDate   datetime not null default current_timestamp,
    salePaymentType   ENUM('cash', 'mobile', 'credit') not null,
    salePaymentAmount decimal(10,2) not null,
    saleId            INT NOT NULL,
    FOREIGN KEY (saleId) REFERENCES sale(saleId)
);

CREATE TABLE sale_credit(
    saleCreditId      int primary key auto_increment,
    saleCreditAmount  decimal(10,2) not null,
    saleCreditDueDate datetime not null default current_timestamp,
    saleId            INT NOT NULL,
    customerId        INT NOT NULL,
    FOREIGN KEY (saleId) REFERENCES sale(saleId),
    FOREIGN KEY (customerId) REFERENCES customer(customerId)
);

CREATE TABLE sale_credit_payment(
    saleCreditPaymentId      int primary key auto_increment,
    saleCreditPaymentDate    datetime not null default current_timestamp,
    saleCreditPaymentAmount  decimal(10,2) not null,
    saleCreditId             INT NOT NULL,
    FOREIGN KEY (saleCreditId) REFERENCES sale_credit(saleCreditId)
);

CREATE TABLE purchase(
    purchaseId          int primary key auto_increment,
    purchaseDate        datetime not null default current_timestamp,
    purchaseTotalAmount decimal(10,2),
    supplierId          INT NOT NULL,
    FOREIGN KEY (supplierId) REFERENCES supplier(supplierId)
);

CREATE TABLE purchase_item(
    purchaseItemId  int primary key auto_increment,
    purchasePrice   decimal(10,2) not null,
    quantity        int not null,
    ProductId       INT NOT NULL,
    purchaseId      INT NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES product(productId),
    FOREIGN KEY (purchaseId) REFERENCES purchase(purchaseId)
);

CREATE TABLE purchase_payment(
    purchasePaymentId       int primary key auto_increment,
    purchasePaymentDate     datetime not null default current_timestamp,
    purchasePaymentType     ENUM('cash', 'mobile', 'credit') not null,
    purchasePaymentAmount   decimal(10,2) not null,
    purchaseId              INT NOT NULL,
    FOREIGN KEY (purchaseId) REFERENCES purchase(purchaseId)
);

create table purchase_credit(
    purchaseCreditId       int primary key auto_increment,
    purchaseCreditAmount   decimal(10,2) not null,
    purchaseCreditDueDate  datetime not null default current_timestamp,
    purchaseId             INT NOT NULL,
    supplierId             INT NOT NULL,
    FOREIGN KEY (purchaseId) REFERENCES purchase(purchaseId),
    FOREIGN KEY (supplierId) REFERENCES supplier(supplierId)
);

create table purchase_credit_payment(
    purchaseCreditPaymentId     int primary key auto_increment,
    purchaseCreditPaymentDate   datetime not null default current_timestamp,
    purchaseCreditPaymentAmount decimal(10,2) not null,
    purchaseCreditId            INT NOT NULL,
    FOREIGN KEY (purchaseCreditId) REFERENCES purchase_credit(purchaseCreditId)
);


INSERT INTO product(productId,~productName,productPurchasingPrice,productSellingPrice,color,productType,productQuantity,productDescription)
VALUES (1,'MDF 18MM',200,500,'white','MDF',50,'white 18MM mdf');

ALTER TABLE sale_payment MODIFY salePaymentId INT AUTO_INCREMENT;

ALTER TABLE product ADD COLUMN isActive TINYINT DEFAULT 1;
UPDATE product SET isActive = 1 WHERE productQuantity > 0;
