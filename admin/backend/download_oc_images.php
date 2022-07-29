<?php
  header("Content-type: application/json; charset=UTF-8");

  require_once __DIR__ . '/../vendor/autoload.php';
  use Facebook\WebDriver\Chrome\ChromeOptions;
  use Facebook\WebDriver\Chrome\ChromeDriver;
  use Facebook\WebDriver\Remote\DesiredCapabilities;
  use Facebook\WebDriver\Remote\RemoteWebDriver;
  use Facebook\WebDriver\WebDriverExpectedCondition;
  use Facebook\WebDriver\WebDriverBy;

  $driverPath = realpath('/usr/local/bin/chromedriver');
  putenv('webdriver.chrome.driver=' . $driverPath);

  $driver = ChromeDriver::start();

  $image_path  =[];
  foreach ($_POST["url"] as $url) {
    // Googleへ遷移
    $driver->get($url);

    // 1秒待機
    $driver->wait(1);

    $img = $driver->findElement(WebDriverBy::cssSelector('div[class^="PageEventDetail_imageWrapperInner_"] img'));

    $img_url = $img->getAttribute('src');
    $img_url = preg_replace("/\?.*$/u","", $img_url);

    $image = file_get_contents($img_url);

    $month = date("n");

    $img_name = basename($img_url);
    $file_name = "10/" . $month . "/" . $img_name;

    file_put_contents("../../images/events/" . $file_name, $image);

    array_push($image_path, $file_name);
  }

  /* print_r($image_path); */
  $json = json_encode($image_path, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  echo $json;

  // ブラウザを閉じる
  $driver->quit();

?>
