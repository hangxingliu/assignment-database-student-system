UPDATE TOP(1)
	TReader 
SET
	Card=@Card,
	Name=@Name,
	Sex=@Sex,
	Born=@Born,
	Spec=@Spec
WHERE ReaderID=@ReaderID;
