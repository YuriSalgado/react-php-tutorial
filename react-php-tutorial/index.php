<?php
// incluir arquivo de configuração
include 'config/core.php';
 
// incluir o modelo de cabeça
include_once "layout_head.php";
 
// espaço reservado para renderizar os componentes do React
echo "<div id='content'></div>";
 
// page footer
include_once "layout_foot.php";
?>