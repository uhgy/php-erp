<?php
	class TeleOrder{

		protected $servername = "139.196.35.42";
		protected $username = "root";
		protected $password = "root";
		protected $orderPerPage = 20;
		public $conn = null;


		public function __construct(){

			try {
			    $this->conn = new PDO("mysql:host=$this->servername;dbname=yjz", $this->username, $this->password);
			    $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			    $this->conn->exec("SET CHARACTER SET UTF8");
		  	}	catch(PDOException $e)
		    {
		    	echo "Error: " . $e->getMessage();
		    }
		}


		public function getRow($sql){
			try{
				$stmt = $this->conn->prepare($sql); 
		    $stmt->execute();
		    // 设置结果集为关联数组
		    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC); 

		    $data = $stmt->fetchAll();
			}	catch(PDOException $e)
		    {
		    	echo "Error: " . $e->getMessage();
		    }
		    // $arr = array('$sql'=>$sql);
			return $data ;
		}

		public function getOnePage($sql, $pageNum){
			$limit = $this->orderPerPage;
			$offset = ($pageNum-1) * $this->orderPerPage;
			$sql2 = $sql . " limit {$limit} offset {$offset}";
			// echo $sql2."\n";
			return $this->getRow($sql2);
		}


		public function addOrder($sql){
			try{
				$stmt = $this->conn->prepare($sql); 
		    $stmt->execute();
			}	catch(PDOException $e)
		    {
		    	echo "Error: " . $e->getMessage();
		    }
		}	

		public function updateOrder($sql){
			try{
				$stmt = $this->conn->prepare($sql); 
		    $stmt->execute();
			}	catch(PDOException $e)
		    {
		    	echo "Error: " . $e->getMessage();
		    }
		}

		public function getOrderSum($sql){
			try{
				$stmt = $this->conn->prepare($sql); 
		    $stmt->execute();
			}catch(PDOException $e)
			{
				echo "Error: " . $e->getMessage(); 
			}
		}
	}
