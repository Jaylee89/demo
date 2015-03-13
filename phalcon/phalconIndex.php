<?php
require __DIR__ . '/../config/services.php';
$application = new Phalcon\Mvc\Application();
$application->setDi($di);
require __DIR__ . '/../config/modules.php';
echo $application->handle()->getContent();

?>
