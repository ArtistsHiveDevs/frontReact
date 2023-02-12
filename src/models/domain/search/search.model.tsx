import { EntityModel, EntityTemplate } from "~/models/base";
import { ArtistModel } from "../artist/artist.model";
import { EventModel } from "../event/event.model";
import { PlaceModel } from "../place/place.model";

export interface SeachTemplate extends EntityTemplate {
    artists?: ArtistModel[];
    events?: EventModel[];
    places?: PlaceModel[];
}

export class SearchModel extends EntityModel<SeachTemplate> implements SeachTemplate {
    declare artists?: ArtistModel[];
    declare events?: EventModel[];
    declare places?: PlaceModel[];

    constructor(template: SeachTemplate) {
        super(template);
        this.artists = template?.artists?.map(artist => new ArtistModel(artist)) || [];
        this.events = template?.events?.map(events => new EventModel(events)) || [];
        this.places = template?.places?.map(places => new PlaceModel(places)) || [];
    }
}