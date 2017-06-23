import React, { Component } from 'react';
import {Texture,StandardMaterial, diffuseTexture, SceneLoader, Engine, Scene, Color4 ,ArcRotateCamera, Vector3,
        Color3, MeshBuilder, Mesh, HemisphericLight, DOUBLESIDE} from 'babylonjs';
import './canvas.css';
import floor from './imgs/floor.jpg';
import wallTexture2 from './imgs/walltexture2.jpg';
import chairImg from './imgs/download.jpg';

var scene;
var loader;
var data;

class Canvas extends Component {

    componentDidMount() {
        var canvas = document.getElementById('renderCanvas');
        var engine = new Engine(canvas, true);
        var createScene = function() {
            scene = new Scene(engine);
            scene.clearColor = new Color4(0.9,0.9, 0.9,1); 
            engine.enableOfflineSupport = false;

            var camera = new ArcRotateCamera("Camera", Math.PI / 3, 1.1, 60, Vector3.Zero(), scene);
            camera.attachControl(canvas, true);

            var light = new HemisphericLight("Hemi0", new Vector3(0, 60, 0), scene);
                light.diffuse = new Color3(1, 1, 1);
                light.specular = new Color3(1, 1, 1);
                light.groundColor = new Color3(0, 0, 0);

            var ground = Mesh.CreateGround('ground1', 50, 25, 0, scene);

            var points = [
                { y: -25, z: 0 },
                { y: 25, z: 0 },                
            ];
            var shape = [];
            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                shape.push(new Vector3(12, point.y, point.z));
            } 

            shape.push(new Vector3(12, points[0].y, points[0].z));
            var path = [new Vector3(0, 0, 0), new Vector3(0, 16, 0)]

            var wall = MeshBuilder.ExtrudeShape('extruded',
            { shape: shape, path: path, sideOrientation: DOUBLESIDE, cap: Mesh.CAP_ALL },
            scene);

            var points2 = [
                { x: 25, y: 0, z: 12},
                { x: 25, y: -16, z: 12 }
                
            ];
            var shape2 = [];
            for (var i = 0; i < points2.length; i++) {
                var point2 = points2[i];
                shape2.push(new Vector3(point2.x, point2.y, point2.z));
            } 

            shape2.push(new Vector3(25, 0, 12));
            var path2 = [new Vector3(0, 16, 24), new Vector3(0, 16, 0)]

            var wall2 = MeshBuilder.ExtrudeShape('extruded2',
            { shape: shape2, path: path2, sideOrientation: DOUBLESIDE, cap: Mesh.CAP_ALL },
            scene);

            var materialGround = new StandardMaterial("textureGround", scene);
            materialGround.diffuseTexture = new Texture(floor, scene);
            materialGround.diffuseTexture.uScale = 8.0;//Repeat 5 times on the Vertical Axes
            materialGround.diffuseTexture.vScale = 8.0;//Repeat 5 times on the Horizontal Axes
            materialGround.backFaceCulling = false;//Always show the front and the back of an element

            var materialWall = new StandardMaterial("textureWall", scene);
            materialWall.ambientTexture = new Texture(wallTexture2, scene);
            materialWall.ambientTexture.uScale = 5.0;//Repeat 5 times on the Vertical Axes
            materialWall.ambientTexture.vScale = 5.0;//Repeat 5 times on the Horizontal Axes
            materialWall.backFaceCulling = false;//Always show the front and the back of an element
            materialWall.diffuseColor = new Color3(1, 1, 1); 

            var materialWall2 = new StandardMaterial("textureWall", scene);
            materialWall2.ambientTexture = new Texture(wallTexture2, scene);
            materialWall2.ambientTexture.uScale = 3.0;//Repeat 5 times on the Vertical Axes
            materialWall2.ambientTexture.vScale = 3.0;//Repeat 5 times on the Horizontal Axes
            materialWall2.backFaceCulling = false;//Always show the front and the back of an element

            ground.material = materialGround;
            wall.material = materialWall;
            wall2.material = materialWall2;

            var startingPoint;
            var currentMesh;

            var getGroundPosition = function () {
                // Use a predicate to get position on the ground
                var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
                if (pickinfo.hit) {
                    return pickinfo.pickedPoint;
                }

                return null;
            }

            var onPointerDown = function (evt) {
                if (evt.button !== 0) {
                    return;
                }

                // check if we are under a mesh
                var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
                if (pickInfo.hit) {
                    currentMesh = pickInfo.pickedMesh;
                    startingPoint = getGroundPosition(evt);

                    if (startingPoint) { // we need to disconnect camera from canvas
                        setTimeout(function () {
                            camera.detachControl(canvas);
                        }, 0);
                    }
                }
            }

            var onPointerUp = function () {
                if (startingPoint) {
                    camera.attachControl(canvas, true);
                    startingPoint = null;
                    return;
                }
            }

            var onPointerMove = function (evt) {
                if (!startingPoint) {
                    return;
                }

                var current = getGroundPosition(evt);

                if (!current) {
                    return;
                }

                var diff = current.subtract(startingPoint);
                currentMesh.position.addInPlace(diff);

                startingPoint = current;

            }

            canvas.addEventListener("pointerdown", onPointerDown, false);
            canvas.addEventListener("pointerup", onPointerUp, false);
            canvas.addEventListener("pointermove", onPointerMove, false);

            scene.onDispose = function () {
                canvas.removeEventListener("pointerdown", onPointerDown);
                canvas.removeEventListener("pointerup", onPointerUp);
                canvas.removeEventListener("pointermove", onPointerMove);
            }


            var v = document.getElementById('mybutton');

            v.onclick = function() {
                if(data != null){
                    var mat = new StandardMaterial("floormaterial", scene);
                    mat.diffuseTexture = new Texture(chairImg,scene);
                    mat.backFaceCulling = false;//Show all the faces of the element

                    loader = SceneLoader.GetPluginForExtension('babylon');
                    loader.load(scene, data,
                        function(newMeshes){
                            newMeshes.forEach(function(mesh){
                                mesh.material = mat;
                            });
                        });
                    scene.clearColor = new Color4(0.9,0.9, 0.9,1); 
                }
            }

            v.addEventListener('click',function(){},false);

                return scene;
            }

        var scene = createScene();

        engine.runRenderLoop(function() {
            scene.render();
        });
    }

    render() {
        data = this.props.data;
        return (
            <canvas id="renderCanvas">

            </canvas>
        );
    }
}

export default Canvas;
