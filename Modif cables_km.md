# Modifications sur cables_km

## 1- Ajout du breadcrumb 

### a- Dans Symfony: voir  BreadConfigController.php
Mise à jour des requêtes SQL dans le fichier

```php
<?php

namespace PNV\CablesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;


class BreadConfigController extends Controller{
    //path : cables/breadcrumb
    public function breadcrumbAction(Request $req){
        $view = $req->get('view');
        $id = $req->get('id');

        $manager = $this->getDoctrine()->getConnection();

        $out = array();
        switch($view){

//==> Mortalité par électrocussions
            case 'mortelec':
                $req = $manager->prepare('SELECT id, especes as label FROM cables.mortalite_electrocutions WHERE id=:id');
                $req->bindValue('id', $id);
                $req->execute();
                $res = $req->fetchAll();
                if(!isset($res[0])){
                    return new JsonResponse(array(array('id'=>null, 'label'=>'Mortalité par électrocussions', 'link'=>'#/cables/mortelec')));
                }
                $res = $res[0];
                if($res['especes']==null){
                    $out[] = array('id'=>$res['id'], 'label'=>implode('/', array_reverse(explode('-', $res['label']))), 'link'=>'#/cables/mortelec/'.$id);
                    $out[] = array('id'=>null, 'label'=>'Mortalité par électrocussions', 'link'=>'#/cables/mortelec');
                    return new JsonResponse(array_reverse($out));
                }
                $out[] = array('id'=>$res['id'], 'label'=>implode('/', array_reverse(explode('-', $res['label']))), 'link'=>'#/cables/mortelec/'.$id);
                $id = $res['especes'];

//==>Troncons ERDF
            
            case 'tronconserdf':
                $req = $manager->prepare('SELECT id, remarques as label FROM cables.troncons_risque_erdf WHERE id=:id');
                $req->bindValue('id', $id);
                $req->execute();
                $res = $req->fetchAll();
                if(!isset($res[0])){
                    return new JsonResponse(array(array('id'=>null, 'label'=>'Tronçons ERDF', 'link'=>'#/cables/tronconserdf')));
                }
                $res = $res[0];
                if($res['remarques']==null){
                    $out[] = array('id'=>$res['id'], 'label'=>implode('/', array_reverse(explode('-', $res['label']))), 'link'=>'#/cables/tronconserdf/'.$id);
                    $out[] = array('id'=>null, 'label'=>'Tronçons ERDF', 'link'=>'#/cables/tronconserdf');
                    return new JsonResponse(array_reverse($out));
                }
                $id = $res['remarques'];

//==>Zones sensibles
            case 'aires':
                $req = $manager->prepare('SELECT id, source as label FROM cables.aires_aigle_royal WHERE id=:id');
                $req->bindValue('id', $id);
                $req->execute();
                $res = $req->fetchAll();
                if(!isset($res[0])){
                    return new JsonResponse(array(array('id'=>null, 'label'=>'Zones sensibles', 'link'=>'#/cables/aires')));
                }
                $res = $res[0];
                $out[] = array('id'=>$res['id'], 'label'=>$res['label'], 'link'=>'#/cables/aires/'.$id);
                $out[] = array('id'=>null, 'label'=>'Zones sensibles', 'link'=>'#/cables/aires');
                
        }
        return new JsonResponse(array_reverse($out));
    }
}


```

### b- Dans AngularJS: voir la directive breadcrumbs dans displayDirectives.js 

voir aussi fichier template htm: js/templates/display/breadcrumbs.htm

ajout du breadcrumb dans les pages avec la div 
```javascript 
<div breadcrumbs appname="{{cables}}"></div> 





