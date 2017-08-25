import { Injectable } from '@angular/core';

function _window():any{
    return window;
}

function getPosition(){
    console.log('Coords: '+_window().navigator.geolocation.getCurrentPosition().coords);
    
}

@Injectable()
export class WindowRef{
    get nativeWindow():any{
        return _window();
    }

  
}