<?php
  $experiences = file_get_contents("../admin/data/experience.json");
  $experiences = json_decode($experiences, true);
  $experience_ids = array_column($experiences["data"], "id");
  $experience_index = array_search($id, $experience_ids);
  $experience = $experiences["data"][$experience_index];

  $atsumori_events = file_get_contents("../admin/data/atsumori_event.json");
  $atsumori_events = json_decode($atsumori_events, true);
  $event_id = $atsumori_events["data"][$experience["atsumori"]];

  $event_list = file_get_contents("../admin/data/ev.json");
  $event_list  = json_decode($event_list, true);
  $event_ids = array_column($event_list["data"], "id");
  $event_index = array_search($event_id, $event_ids);
  $event = $event_list["data"][$event_index];
  $image = $event["image"];
  $title = $event["title"];
  $url = $event["url"];

  echo <<< EOM
    <img src="../images/events/${image}" class="sample_img">
    <div>
      ${title}
    </div>
    <a href="${url}" target=_blank class="background"></a>
  EOM;
?>
