import { EntityModel, EntityTemplate } from "~/models/base";
import { GeneralMusicalInstrumentModel } from "~/models/domain/musical-instrument/musical-instrument";

export interface CrewMemberTemplate {
  name: string;
  document_type: string;
  document_number: string;
  role: string;
}

export interface CrewTeamTemplate {
  artists: CrewMemberTemplate[];
  managers?: CrewMemberTemplate[];
  engineers?: CrewMemberTemplate[];
  roadies?: CrewMemberTemplate[];
  security?: CrewMemberTemplate[];
  others?: CrewMemberTemplate[];
}

export interface InputRiderTemplate {
  channelNumber: number;
  instrument?: GeneralMusicalInstrumentModel;
  instrumentName?: string;
  microphone?: string;
  stand?: string;
  inserts?: string;
}

export interface MixRiderTemplate {
  mixNumber: number;
  description: string;
  monitor: string;
  notes?: string;
}

export interface StageSpecs {
  length: number;
  height: number;
  width: number;
  unitMeasure: string;
  color?: string;
}
export interface ArtistRiderTemplate extends EntityTemplate {
  artistId: string;
  name: string;
  instruments: GeneralMusicalInstrumentModel[];
  inputList: InputRiderTemplate[];
  mixesList: MixRiderTemplate[];
  crewList: CrewTeamTemplate;
  stageSpecs: StageSpecs;
  created_at: Date;
  updated_at: Date;
}
export class ArtistRiderModel
  extends EntityModel<ArtistRiderTemplate>
  implements ArtistRiderTemplate
{
  artistId: string;
  name: string;
  instruments: GeneralMusicalInstrumentModel[];
  inputList: InputRiderTemplate[];
  mixesList: MixRiderTemplate[];
  crewList: CrewTeamTemplate;
  stageSpecs: StageSpecs;
  created_at: Date;
  updated_at: Date;

  constructor(template: ArtistRiderTemplate) {
    super(template);
    this.instruments = template.instruments || [];
    this.inputList = template.inputList || [];
    this.mixesList = template.mixesList || [];
  }

  get crewMembersByRole(): { role: string; people: CrewMemberTemplate[] }[] {
    const crewMembers: { role: string; people: CrewMemberTemplate[] }[] = [];

    return crewMembers;
  }
}
