 <?php
	$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "findOrder";
	$teleNum = isset($_REQUEST["teleNum"]) ? $_REQUEST["teleNum"] : "";
	$orderNum = isset($_REQUEST["orderNum"]) ? $_REQUEST["orderNum"] : "";
	$recordOfService = isset($_REQUEST["recordOfService"]) ? $_REQUEST["recordOfService"] : " ";
	$dateOfTele = isset($_REQUEST["dateOfTele"]) ? $_REQUEST["dateOfTele"] : "";
	$typeOfService = isset($_REQUEST["typeOfService"]) ? $_REQUEST["typeOfService"] : " ";
	$nameOfStuff = isset($_REQUEST["nameOfStuff"]) ? $_REQUEST["nameOfStuff"] : " ";
	$pageNum = isset($_REQUEST["pageNum"]) ? $_REQUEST["pageNum"] : "1"; 
	$startCallinDate = isset($_REQUEST["startCallinDate"]) ? $_REQUEST["startCallinDate"] : ""; 	
	$endCallinDate = isset($_REQUEST["endCallinDate"]) ? $_REQUEST["endCallinDate"] : ""; 	

	// * Error reporting 
	// error_reporting(E_ALL);
	// ini_set('display_errors', TRUE);
	// ini_set('display_startup_errors', TRUE);
	date_default_timezone_set('Asia/Shanghai');


	//TeleOrder class operation
	include_once 'TeleOrder.php';
	/** Include PHPExcel */
	include_once dirname(__FILE__) . '/phpExcel/Classes/PHPExcel.php';


	//查询订单
	if($action == "findOrder"){ 
	  	if(!empty($teleNum)){
			$sql = "select * from teleRecord where teleNum like '{$teleNum}%' order by dateOfTele desc";
		} else if(!empty($orderNum)){
			$sql = "select * from teleRecord where orderNum like '%{$orderNum}%' order by dateOfTele desc";
		} else if(!empty($recordOfService)){
			$sql = "select * from teleRecord where recordOfService like '%{$recordOfService}%' order by dateOfTele desc";
		}else{
			$sql = "select * from teleRecord order by dateOfTele desc";	//        offset " + $pageNum  + "	
		}
		$teleOrder = new TeleOrder();
		$data = $teleOrder->getOnePage($sql, $pageNum);
		// echo $sql;
		$orderNum = $teleOrder->getOrderSum($sql);
		echo json_encode(
			array('data' => $data)
			);

	}


	//增加订单
	if($action == "addOrder"){
		$teleOrder = new TeleOrder();
		if((!empty($teleNum)) || (!empty($orderNum))){
			$currentTime = date("Y-m-d H:i:s",time());
			// echo $currentTime;
			// $currentTime . Now();
			$sql = "INSERT INTO teleRecord
							VALUES ('{$teleNum}', '{$orderNum}', '{$recordOfService}', '{$currentTime}', '{$currentTime}', '{$typeOfService}', '{$nameOfStuff}')";

			$teleOrder->addOrder($sql);		
		}
		$sql2 = "select * from teleRecord where dateOfTele='{$currentTime}' order by dateOfTele desc";
		$data = $teleOrder->getOnePage($sql2, $pageNum);
		// echo $sql;
		echo json_encode(
			array('data' => $data)
			);
	}

	//更新订单
	if($action == "updateOrder"){
		if(!empty($dateOfTele)){
			$teleOrder = new TeleOrder();
			 if (!empty($recordOfService)){
				$sql = "UPDATE teleRecord SET teleNum='{$teleNum}', 
									orderNum = '{$orderNum}', 
									typeOfService='{$typeOfService}', 
									recordOfService=CONCAT( '{$recordOfService}', ' ', '{$nameOfStuff}', NOW(), '<br>', recordOfService), 
									nameOfStuff='{$nameOfStuff}', 
									dateOfLastEdit=NOW()
				WHERE dateOfTele='{$dateOfTele}'";
			}else{
				$sql = "UPDATE teleRecord SET teleNum='{$teleNum}', 
									orderNum = '{$orderNum}', 
									typeOfService = '{$typeOfService}',
									recordOfService = CONCAT( '{$nameOfStuff}', NOW(), '<br>', recordOfService), 
									nameOfStuff = '{$nameOfStuff}', 
									dateOfLastEdit = NOW()
				WHERE dateOfTele='{$dateOfTele}'";
			}				
			$teleOrder->updateOrder($sql);

			// if (!empty($recordOfService)){
			// 	$sql = "UPDATE teleRecord SET recordOfService='{$recordOfService}', dateOfLastEdit=NOW()
			// 				WHERE dateOfTele='{$dateOfTele}'";				
			// 	$teleOrder->updateOrder($sql);
			// }		
		}
		// $teleOrder = new TeleOrder();
		$sql2 = "select * from teleRecord where dateOfTele='{$dateOfTele}' order by dateOfTele desc";
		$data = $teleOrder->getOnePage($sql2, $pageNum);
		echo json_encode(
			array('data' => $data)
			);
	}

	//按天查找订单
	if($action == "findOrderByDate"){
		$sql = "select * from teleRecord where dateOfTele like '{$dateOfTele}%' order by dateOfTele desc";
		// admin_redirect('tele.html', 'adsf', 1);
		$teleOrder = new TeleOrder();
		$data = $teleOrder->getOnePage($sql, $pageNum);
		// echo $sql;
		echo json_encode(
			array('data' => $data)
			);

	}

	//按电话号码查找订单
	if($action == "findOrderByTele"){
		$sql = "select * from teleRecord where teleNum = '{$teleNum}' order by dateOfTele desc";
		$teleOrder = new TeleOrder();
		$data = $teleOrder->getOnePage($sql, $pageNum);
		// echo $sql;
		echo json_encode(
			array('data' => $data)
			);
	}


	if($action == "findBeforeDate"){
		$endCallinDate = date("Y-m-d", strtotime( "$endCallinDate + 1 day"));
		$sql = "select * from teleRecord where dateOfTele >= '{$startCallinDate}' and dateOfTele  <= '{$endCallinDate}' order by dateOfTele desc";
		$teleOrder = new TeleOrder();
		$data = $teleOrder->getOnePage($sql, $pageNum);
		// echo $sql;
		echo json_encode(
			array('data' => $data)
			);		
	}

	//导出excel
	if($action == "exportExcel"){
		$endCallinDate = date("Y-m-d", strtotime( "$endCallinDate + 1 day"));
		$sql = "select * from teleRecord where dateOfTele >= '{$startCallinDate}' and dateOfTele <= '{$endCallinDate}' order by dateOfTele desc";
		$teleOrder = new TeleOrder();
		// $data = $teleOrder->getOnePage($sql, $pageNum);
		// echo $sql;
		// echo json_encode($data);
		// Create new PHPExcel object
		$outputData = $teleOrder->getRow($sql);
		exportExcel($outputData);
		echo sizeof($outputData);
	}

	//导出excel
	function exportExcel($outputData){
		$objPHPExcel = new PHPExcel();

		// echo json_encode($outputData);
		// print_r("<pre>");
		// print_r($outputData);

		$objPHPExcel->setActiveSheetIndex(0)
				            ->setCellValue('A1', '呼入日期')
				            ->setCellValue('B1', '电话号码')
				            ->setCellValue('C1', '订单号码')
				            ->setCellValue('D1', '业务种类')
				            ->setCellValue('E1', '客服记录')
				            ->setCellValue('F1', '处理人')
				            ->setCellValue('G1', '处理日期');

		$row = 2;
		$cellName = '';
		foreach($outputData as $order=>$orderValue){
			foreach($orderValue as $columnName=>$columnValue){
				switch($columnName){
					case "dateOfTele":
						$cellName = 'A' . $row;
						break;
					case "teleNum":
						$cellName = 'B' . $row;
						break;
					case "orderNum":
						$cellName = 'C' . $row;
						break;
					case "typeOfService":
						$cellName = 'D' . $row;
						break;
					case "recordOfService":
						$cellName = 'E' . $row;
						break;
					case "nameOfStuff":
						$cellName = 'F' . $row;
						break;
					case "dateOfLastEdit":
						$cellName = 'G' . $row;
						break;
					default :
						break;
				}
				// echo  $cellName . " = " . $columnValue . "  ";
				$objPHPExcel->setActiveSheetIndex(0)
				            ->setCellValue($cellName, $columnValue);								
			}
			// echo "<br>";
			$row ++;
		}
		$objPHPExcel->getActiveSheet()->setTitle('1');
		// Set active sheet index to the first sheet, so Excel opens this as the first sheet
		$objPHPExcel->setActiveSheetIndex(0);		
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$file = dirname(__FILE__) . '/excelFolder/1.xlsx';		
		$objWriter->save($file);
		chmod($file, 0777);
		// include_once 'download.html';
		// include_once 'downloadExcel.php';
		// exit;
		// echo("<script>location.href = '".ADMIN_URL."/index.php?msg=$msg';</script>");
	}


	// function downloadexcel(){

	// 	$file = fopen($file_dir . $file_name,"r"); // 打开文件
	// 	// 输入文件标签
	// 	Header("Content-type: application/octet-stream");
	// 	Header("Accept-Ranges: bytes");
	// 	Header("Accept-Length: ".filesize($file_dir . $file_name));
	// 	Header("Content-Disposition: attachment; filename=" . $file_name);
	// 	// 输出文件内容
	// 	echo fread($file,filesize($file_dir . $file_name));
	// 	fclose($file);
	// 	exit();
	// }
