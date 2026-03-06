CREATE TABLE slike (
    id_slike INT AUTO_INCREMENT PRIMARY KEY,

    veza_tablica VARCHAR(50) NOT NULL,
    veza_objekt INT NOT NULL,

    tip_slike VARCHAR(50) NOT NULL,

    mime_type VARCHAR(50) NOT NULL,
    data LONGBLOB NOT NULL,
    size INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_veza (veza_tablica, veza_objekt),
    INDEX tip_slike (tip_slike)
);

DELIMITER $$
CREATE PROCEDURE DeleteWithImages(
    IN p_table_name VARCHAR(50),
    IN p_record_id INT
)
BEGIN
    DECLARE v_pk_column VARCHAR(64);
    DECLARE v_has_images BOOLEAN DEFAULT FALSE;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    -- Quick check if images exist (cheap with index)
    SELECT EXISTS(
        SELECT 1 FROM slike 
        WHERE veza_tablica = p_table_name 
        AND id_veze = p_record_id
    ) INTO v_has_images;
    
    -- Only start transaction if we have something to delete
    IF v_has_images THEN
        START TRANSACTION;
        
        DELETE FROM slike 
        WHERE veza_tablica = p_table_name 
        AND id_veze = p_record_id;
    ELSE
        -- No images, just proceed with main delete
        START TRANSACTION;
    END IF;
    
    -- Get primary key column
    SELECT COLUMN_NAME INTO v_pk_column
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = p_table_name
        AND CONSTRAINT_NAME = 'PRIMARY'
    LIMIT 1;
    
    -- Delete main record
    SET @sql = CONCAT('DELETE FROM ', p_table_name, ' WHERE ', v_pk_column, ' = ?');
    SET @id = p_record_id;
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING @id;
    DEALLOCATE PREPARE stmt;
    
    COMMIT;
END$$
DELIMITER ;
