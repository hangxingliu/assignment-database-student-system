UPDATE TOP(1)
	TBookInfo 
SET 
	ISBN=@ISBN, 
	BookName=@BookName, 
	Author=@Author, 
	Publisher=@Publisher, 
	Price=@Price, 
	Summary=@Summary
WHERE
	BookInfoID=@BookInfoID