<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require "vendor/autoload.php";
require "vendor/notorm/NotORM.php";

$configuration = [
	'settings' => [
		'displayErrorDetails' => true,
		'db' => [
			'host' => '127.0.0.1',
			'dbname' => 'olhovivo',
			'user' => 'olhovivo',
			'pass' => '123mudar'
		],
	],
];
$c = new \Slim\Container($configuration);

$c['notFoundHandler'] = function ($c) {
	return function (Request $request, Response $response) use ($c) {
		$json = [
			'erro' => [
				'codigo' => 404,
				'mensagem' => "Not Found"
			]
		];
		return $response
			->withStatus(200)
			->withHeader('Content-Type', 'application/json')
			->withJson($json);
	};
};

$c['db'] = function ($c) {
	$settings = $c->get('settings')['db'];
	$pdo = new PDO("mysql:host=" . $settings['host'] . ";dbname=" . $settings['dbname'], $settings['user'], $settings['pass']);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	return $pdo;
};

$app = new \Slim\App($c);
//$app = new \Slim\App;

$app->get("/olhoVivo", function (Request $request, Response $response) {
	return $response->withJson(['v' => '0.1', 'API' => 'olhoVivo', 'opcoes' => ['rota' => ['uso' => '/olhoVivo/rota/$letreiro/$sentido', 'argumentos'=> ['letreiro' => 'Numero completo da linha', 'sentido' => "Sentido da linha (terimnal secundario para principal 0, terminal principal para secundario 1). Default: 0"]]]]);
});

$app->get('/hello/{name}', function (Request $request, Response $response, array $args) {
	$name = $args['name'];
	$response->getBody()->write("Hello, $name");
	return $response;
});

$app->get("/olhoVivo/rota/{letreiro}/{sentido}", function(Request $request, Response $response, array $args) {
	$letreiro = $args['letreiro'];
	$sentido = $args['sentido'];
	if($sentido == 2) $sentido = 1;
	else $sentido = 0;
	$trip_id = $letreiro . '-' . $sentido;

	$shape_id = $this->db->prepare("SELECT shape_id FROM trips WHERE trip_id = :tripe_id");
	$shape_id->bindvalue(':tripe_id', $trip_id);
	$shape_id->execute();
	$id = $shape_id->fetch()['shape_id'];

	$shapes = $this->db->prepare("SELECT shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled FROM shapes WHERE shape_id = :shape_id");
	$shapes->bindValue(':shape_id', $id);
	$shapes->execute();
	$data = $shapes->fetchAll();

	return $response->withJson(['id' => $trip_id, 'shape_id' => $id, 'data' => $data]);
});

$app->run();
