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

  ob_start();
  foreach ($_POST["data"] as $index => $section) {
    $title = $section["title"];
    echo <<<EOM
      <div class="section">
        <h2>
          <a id="$index">
            $title
          </a>
        </h2>

    EOM;
    foreach ($section["contents"] as $content) {
      $title = $content["title"];
      $text = $content["content"];
      echo <<< EOM
        <h3>
          $title
        </h3>
        <div class="text">
          $text
        </div>

      EOM;
    }
    echo "</div>";
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
                <h1>日本総合研究所の選考体験記</h1>

                <div class="section">
                    <h2>目次</h2>
                    <div class="flow">
                        <ul class="cp_stepflow01">
                          <li>
                              <span class="bubble"></span>
                              <a href="#entry-sheet">
                                  <div>
                                      <img src="../../images/experience/paper.png">
                                      ES/Webテスト
                                  </div>
                              </a>
                          </li>
                          <li>
                              <span class="bubble"></span>
                              <a href="#interview1">
                                  <div>
                                      <img src="../../images/experience/interview.png">
                                      面接 1
                                  </div>
                              </a>
                          </li>
                          <li>
                              <span class="bubble"></span>
                              <a href="#intern">
                                  <div>
                                      <img src="../../images/experience/intern.png">
                                      インターン
                                  </div>
                              </a>
                          </li>
                          <li>
                              <span class="bubble"></span>
                              <a href="#employee-interview">
                                  <div>
                                      <img src="../../images/experience/interview.png">
                                      社員面談
                                  </div>
                              </a>
                          </li>
                          <li>
                              <span class="bubble"></span>
                              <a href="#director-interview">
                                  <div>
                                      <img src="../../images/experience/interview.png">
                                      部長面談
                                  </div>
                              </a>
                          </li>
                          <li>
                              <span class="bubble"></span>
                              <a href="#es">
                                  <div>
                                      <img src="../../images/experience/paper.png">
                                      ES
                                  </div>
                              </a>
                          </li>
                          <li>
                              <span class="bubble"></span>
                              <a href="#final-interview">
                                  <div>
                                      <img src="../../images/experience/interview.png">
                                      最終面接
                                  </div>
                              </a>
                          </li>
                          <li>
                              <span class="bubble last"></span>
                              <a href="#unofficial-decision">
                                  <div>
                                      <img src="../../images/experience/good.png">
                                      内定
                                  </div>
                              </a>
                          </li>
                          <li>
                              <span class="bubble"></span>
                              <a href="#impressions">
                                  <div>
                                      <img src="../../images/experience/impressions.png">
                                      選考の感想
                                  </div>
                              </a>
                          </li>
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
