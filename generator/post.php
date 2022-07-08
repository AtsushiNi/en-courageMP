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
                  $title
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
    $atsumori_event = <<< EOM
      <div class="atsumori-event">
        <h2>対策イベント！</h2>
        <a href="#q_02"><img src="../../images/self-analysis/IMG_5935.JPG" class="sample_img"></a>
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
    <head>
        <meta charset='utf-8' />
        <link href='../../css/default.css' rel='stylesheet' />
        <link href='../../css/experience.css' rel='stylesheet' />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.4/css/all.css">
    </head>
    <?php \$Path = '../../'; ?>

    <body>
        <?php include(__DIR__ . '/../../components/header.html'); ?>
        <div class="content">
            <main>
                <img src="../../images/self-analysis/IMG_5934.PNG" class="sample_img">
                <h1>${company_name}の選考体験記</h1>

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
        <script type="text/javascript" src="../../js/footer_script.js"></script>
    </body>
</html>
EOM;

  $tmp_html_name = "tmp/" . $new_file_number . "_tmp.html";
  file_put_contents($tmp_html_name, $html);

  echo $tmp_html_name;
  exit;
?>
