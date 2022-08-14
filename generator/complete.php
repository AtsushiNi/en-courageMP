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

  // 編集中のデータ
  $tmp_json_name = "tmp/" . $new_file_number . "_tmp.html";
  $html = file_get_contents($tmp_json_name);
  // リンク張り替え
  $html = str_replace('../../', '../', $html);
  // Googleタグマネージャーのタグを挿入
  $part = explode("<head>", $html);
  $tag = <<< EOM
    <head>
      <!-- 閲覧者がメンターかエンターかをGTMが判別するためのコード -->
      <script>
          const userName = "<?php array_key_exists('REMOTE_USER', $_SERVER) && print_r($_SERVER['REMOTE_USER']);?>"
          window.dataLayer = window.dataLayer || [];
          dataLayer.push({
              "userName": userName
          })
      </script>

      <!-- Google Tag Manager -->
      <script>
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-WLHCR88');
      </script>
      <!-- End Google Tag Manager -->
  EOM;
  $html = $part[0] . $tag . $part[1];
  $part = explode("<body>", $html);
  $tag = <<< EOM
    <body>
      <!-- Google Tag Manager (noscript) -->
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WLHCR88"
      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
      <!-- End Google Tag Manager (noscript) -->
  EOM;
  $html = $part[0] . $tag . $part[1];

  // HTML生成
  $html_name = "../experiences/" . $new_file_number . ".html";
  file_put_contents($html_name, $html);

  // tmpファイルを削除
  array_map('unlink', glob('tmp/*.*'));

  echo $html_name;

  exit;
?>
