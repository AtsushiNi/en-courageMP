<?php
  header("Content-type: text/plain; charset=UTF-8");

  // 体験記の最新番号を取得
  $dir = "../experiences/";
  $files = glob($dir . "*.html");
  $numbers = [];
  foreach ($files as $file){
    preg_match('/[0-9]+/', $file, $matches) . "<br>";
    $numbers[] = (int) $matches[0];
  }

  $new_file_number = max($numbers) + 1;
  $tmp_json_name = "tmp/" . $new_file_number . "_tmp.json";

  // jsonファイルの作成
  file_put_contents($tmp_json_name, json_encode($_POST, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

  $company_name = $_POST["data"]["title"];

  ob_start();
  foreach ($_POST["data"]["mokujis"] as $index => $mokuji) {
    $title = $mokuji["title"];
    $iconURL = "../../images/experience/" . $mokuji["icon"] . ".png";
    $class = $mokuji["title"] == "内定"? "bubble last" : "bubble";
    echo <<<EOM
      <li>
          <span class="$class"></span>
          <a href="#$index">
              <div>
                  <img src="$iconURL">
                  <div>
                    $title
                  </div>
              </div>
          </a>
      </li>

    EOM;
  }
  $mokujis = ob_get_contents();
  ob_end_clean();

  ob_start();
  foreach ($_POST["data"]["sections"] as $index => $section) {
    $title = $section["title"];
    $atsumori = $section["atsumori"] == "true" ? "atsumori" : "";
    $atsumori_event = <<< 'EOM'
      <div class="atsumori-event">
        <h2>対策イベント！</h2>
        <div class="event">
          <?php
            $page_title = basename(__FILE__);
            preg_match("/[0-9]+/", $page_title, $id);
            $id = $id[0];
            require("../backend/get_atsumori_event.php");
          ?>
        </div>
      </div>

    EOM;

    echo <<<EOM
      <div class="section $atsumori">
        <h2>
          <a id="$index">
            $title
          </a>
        </h2>

    EOM;
    if (!empty($section["table"])) {
      echo <<< EOM
        <div class="table">
          <table>
            <tbody>

      EOM;
      foreach ($section["table"] as $table) {
        $key = $table["key"];
        $value = $table["value"];
        echo <<< EOM
          <tr>
            <th>
              $key
            </th>
            <td>
              $value
            </td>
          </tr>

        EOM;
      }
      echo <<< EOM
            </tbody>
          </table>
        </div>

      EOM;
    }

    if(!empty($section["contents"])) {
      foreach ($section["contents"] as $content) {
        $title = $content["title"];
        $text = nl2br($content["content"]);
        echo <<< EOM
          <h3>
            $title
          </h3>
          <div class="text">
            $text
          </div>

        EOM;
      }
    }

    echo "</div>";

    if($section["atsumori"] == "true") {
      echo $atsumori_event;
    }
  }
  $sections = ob_get_contents();
  ob_end_clean();

  $html = <<< EOM
<!DOCTYPE html>
<html>

<?php \$Path = '../../'; ?>

<head>
  <?php include(__DIR__ . '/../../components/head.html'); ?>
  <link rel='stylesheet' href='../../css/experience.css'/>
</head>

<body>
  <?php include(__DIR__ . '/../../components/header.html'); ?>
  <div class="content">
    <main>
      <div class="section title">
        <img src="../../images/self-analysis/IMG_5934.PNG" class="sample_img">
        <h1>${company_name}の選考体験記</h1>
      </div>

      <div class="section">
        <h2>目次</h2>
        <div class="flow">
          <ul class="cp_stepflow01">
            $mokujis
          </ul>
        </div>
      </div>
    $sections
    </main>
    <?php include(__DIR__ . '/../../components/sidebar.html'); ?>
  </div>
  <div id="page_top"><a href="#"></a></div>
  <?php include(__DIR__ . '/../../components/footer.html'); ?>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script type="text/javascript" src="../../js/script.js"></script>
  <script type="text/javascript" src="../js/sidebar_script.js"></script>
  <script type="text/javascript" src="../../js/header_script.js"></script>
  <script type="text/javascript" src="../../js/footer_script.js"></script>
</body>
</html>
EOM;

  $tmp_html_name = "tmp/" . $new_file_number . "_tmp.html";
  file_put_contents($tmp_html_name, $html);

  echo $tmp_html_name;
  exit;
?>
