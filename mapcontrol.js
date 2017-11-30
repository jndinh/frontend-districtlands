class _mapControl
{
    constructor()
    {
        this.emap=document.querySelector(".map");
        this.map=new google.maps.Map(this.emap,{
            center:{lat:38.682,lng:-77.344},
            zoom:8
        });

        this.direction=new google.maps.DirectionsService();

        this.menu=document.querySelector(".menu-bar");
        this.currentMenuState=1;

        this.userSelectMode=0;

        this.menuSet();
        this.mapButtons();
        this.loadBorder();
        this.genFourColour();
    }

    menuSet()
    {
        this.expandMenuButton=this.menu.querySelector(".expand");
        this.menu.querySelector(".minimise").addEventListener("click",(e)=>{
            this.menuBarState(this.currentMenuState-1);
        });

        this.menu.querySelector(".user-start").addEventListener("click",(e)=>{
            this.selectTrack();
        });

        this.menu.querySelector(".pd-start").addEventListener("click",(e)=>{
            this.loadGeoJsonTest();
        });

        this.menu.querySelector(".maximise").addEventListener("click",(e)=>{
            this.menuBarState(3);
        });

        this.expandMenuButton.addEventListener("click",(e)=>{
            if (this.currentMenuState==1)
            {
                this.menuBarState(2);
            }

            else
            {
                this.menuBarState(1);
            }
        });
    }

    mapButtons()
    {
        this.menuShow=document.createElement("div");
        this.menuShow.classList.add("menu-show","hidden");
        this.menuShow.innerHTML="▴";

        this.menuShow.addEventListener("click",(e)=>{
            this.menuBarState(1);
        });

        this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(this.menuShow);
    }

    selectTrack()
    {
        this.fadeBorder();
        this.userSelectMode=1;
        this.map.data.loadGeoJson("geodata/md.geojson",{},(features)=>{
            for (var x=0,l=features.length;x<l;x++)
            {
                this.map.data.overrideStyle(features[x],{
                    strokeWeight:0
                });
            }
        });

        this.map.data.addListener("mouseover",(e)=>{
            if (e.feature.getProperty("TRACTCE") && this.userSelectMode)
            {
                this.map.data.overrideStyle(e.feature,{
                    strokeWeight:1
                });
            }
        });

        this.map.data.addListener("mouseout",(e)=>{
            if (e.feature.getProperty("TRACTCE") && this.userSelectMode)
            {
                this.map.data.overrideStyle(e.feature,{
                    strokeWeight:0
                });
            }
        });

        this.map.data.addListener("click",(e)=>{
            if (e.feature.getProperty("TRACTCE") && this.userSelectMode)
            {
                console.log(e.feature.getProperty("TRACTCE"));
                this.map.data.overrideStyle(e.feature,{
                    strokeWeight:0
                });
                this.userSelectMode=0;
            }
        });
    }

    //load geojson from a file and alternate colouring
    //between red and blue
    loadGeoJsonTest()
    {
        this.map.data.loadGeoJson("geodata/md-district.geojson",{},(features)=>{
            var colourCount=0;
            for (var x=0,l=features.length;x<l;x++)
            {
                this.map.data.overrideStyle(features[x],{
                    fillColor:this.Rcolours[colourCount],
                    fillOpacity:.5,
                    strokeColor:this.Rcolours[colourCount]

                });

                colourCount++;

                if (colourCount>=this.Rcolours.length)
                {
                    colourCount=0;
                }
            }
        });

        // var mapcolorCount=1;

        // this.map.data.setStyle((f)=>{
        //     var color="red";

        //     if (mapcolorCount%2)
        //     {
        //         color="blue";
        //     }

        //     mapcolorCount++;

        //     return {fillColor:color,strokeColor:color,strokeWeight:1};
        // });



        var infowindow=new google.maps.InfoWindow({
            content:`<table class="info-table"><tbody><tr><td>sample</td><td>data</td></tr><tr><td>sample</td><td>data</td></tr><tr><td>sample</td><td>data</td></tr></tbody></table>`
        });

        this.map.data.addListener("click",(e)=>{
            // console.log(e.latLng.lat());
            // console.log(e.latLng.lng());

            infowindow.setPosition(e.latLng);
            infowindow.open(this.map);
        });
    }

    loadBorder()
    {
        this.map.data.setStyle({
            fillOpacity:0,
            strokeWeight:0
        });

        this.map.data.loadGeoJson("geodata/md-border.geojson",{},(feature)=>{
            this.border=feature[0];
            this.map.data.overrideStyle(feature[0],{
                strokeColor:"#e7395a",
                fillColor:"#e7395a",
                fillOpacity:.1,
                strokeWeight:2
            });
        });
    }

    /*0: gone
      1: normal
      2: expanded
      3: maximised */
    menuBarState(state)
    {
        if (state<0)
        {
            state=0;
        }

        this.currentMenuState=state;
        switch (state)
        {
            case 1:
            this.menu.classList.remove("expanded");
            this.menu.classList.remove("hidden");
            this.menuShow.classList.add("hidden");
            this.emap.classList.remove("unmaximise");
            this.expandMenuButton.innerText="additional information";
            break;

            case 2:
            this.menu.classList.add("expanded");
            this.emap.classList.remove("unmaximise");
            this.expandMenuButton.innerText="minimise additional information";
            break;

            case 0:
            this.menu.classList.remove("expanded");
            this.menu.classList.add("hidden");
            this.menuShow.classList.remove("hidden");
            this.emap.classList.remove("unmaximise");
            this.expandMenuButton.innerText="additional information";
            break;

            case 3:
            this.emap.classList.add("unmaximise");
            break;
        }
    }

    genFourColour()
    {
        // var hues=[randint(37,48),randint(349,359),randint(203,249),randint(29,155)];
        var hues=[randint(0,96),randint(97,179),randint(180,260),randint(261,359)];

        shuffleArray(hues);

        this.Rcolours=[];
        for (var x=0;x<4;x++)
        {
            this.Rcolours.push("#"+new tinycolor(`hsv(${hues[x]},75,91)`).toHex());
        }

        for (var x=0;x<4;x++)
        {
            this.Rcolours.push("#"+new tinycolor(`hsv(${hues[x]},54,97)`).toHex());
        }

        console.log(this.Rcolours);
    }

    fadeBorder()
    {
        this.map.data.overrideStyle(this.border,{
            fillOpacity:0
        });
    }
}