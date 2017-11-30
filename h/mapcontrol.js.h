class _mapControl
{
    /*-- gmap api stuff --*/
    element emap;
    Map map; //map object from google map api
    DirectionService direction; //direction service object

    /*-- map control stuff --*/
    element menu; //main menu bar element
    element menuShow; //custom button inserted into google map
    element expandMenuButton;
    int currentMenuState;

    /*-- geo feature stuff --*/
    string-array Rcolour;
    feature border;
    int userSelectMode;

    /*-- initialisation --*/
    void menuSet(); //menu actions
    void mapButtons(); //custom buttons rendered by google map
    void loadBorder();
    void genFourColour();

    /*-- map functions --*/
    void selectTrack();
    void loadGeoJsonTest();

    /*-- utility --*/
    void menuBarState(int state);
    void fadeBorder();
}