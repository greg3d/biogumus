<?php
require_once MODX_CORE_PATH . "components/shopkeeper3/model/shopkeeper.class.php";

if (!function_exists(Get_Price)) {
    function Get_Price($id)
    {
        global $modx;

        //Добавить свой package
        $base_path = !empty($base_path) ? $base_path : $modx->getOption('core_path') . 'components/shop/';
        $modx->addPackage('shop', $base_path . 'model/');

        /*Выбираем значение полей таблицы shop_content*/
        $resource = $modx->getObject('ShopContent', array('id' => $id));

        $price = $resource->get('price'); // Основная цена
        $price_samara = $resource->get('price_action'); // Самарская цена
        $price_dv = $resource->get('price_dv'); // Сибирский фед округ

        $result_price = $price;

        $result_price = $modx->runSnippet('geo-price2', array(
            'pr1' => $price_samara,
            'pr2' => $price,
            'pr3' => $price_dv
        ));

        $vol = $resource->get('weight');
        $type = $resource->get('type');

        $k = 1;
        switch ($type) {
            case "жидкий":
                $k = 1;
                break;

            case "концентрат":
                $k = 0.5;
                break;
            case "эко-грунт":
                $k = 0.357142;
                break;
        }
        $wgt = round($vol * $k, 1);

        $opt = false;

        $rrr = array(
            'price' => $result_price,
            'weight' => $wgt,
            'volume' => $vol
        );

        return $rrr;
    }
}

$e = $modx->event->name;

switch ($modx->event->name) {

    case 'OnSHKbeforeCartLoad':

        $_SESSION['biogumus']['weight'] = 0;
        $_SESSION['biogumus']['volume'] = 0;

        if (!empty($_SESSION['shk_order'])) {

            $weight = 0;
            $volume = 0;

            $purchases = $_SESSION['shk_order']; //получаем массив с товарами в корзине

            $fprice = 0;

            foreach ($purchases as $key => $product) { //перебираем товар
                $id = $product['id']; //получаем id текущего товара
                $props = Get_Price($id);

                $_SESSION['shk_order'][$key]['price'] = $props['price'];
                $weight = $weight + $props['weight'] * $product['count'];
                $volume = $volume + $props['volume'] * $product['count'];
                $fprice += $product['count'] * $props['price'];
            }

            $ff = $modx->runSnippet('freedelivery_test', array(
                'price_total' => $fprice
            ));

            $modx->setPlaceholders(array(
                'volume' => $volume,
                'weight' => $weight,
                'full' =>  $ff['output'],
                'percent' => $ff['percent']
            ), 'my.');

            $_SESSION['biogumus']['weight'] = $weight;
            $_SESSION['biogumus']['volume'] = $volume;
            $_SESSION['biogumus']['percent'] = $ff['percent'];
        }

        $modx->event->_output = '';

        break;

    case 'OnSHKgetProductPrice':

        $p = Get_Price($id);
        $output = $p['price'];
        $modx->event->output($output);

        break;
}
