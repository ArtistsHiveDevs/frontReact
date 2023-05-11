import { EntityModel, EntityTemplate } from "~/models/base";
import { GeneralMusicalInstrumentModel } from "~/models/domain/musical-instrument/musical-instrument";

export interface CrewMemberTemplate {
  name: string;
  artistic_name?: string;
  document_type?: string;
  document_number?: string;
  role: string;
  dietary_restrictions?: string;
  allergies?: string[];
}

export interface CrewTeamTemplate {
  artists: CrewMemberTemplate[];
  managers?: CrewMemberTemplate[];
  engineers?: CrewMemberTemplate[];
  roadies?: CrewMemberTemplate[];
  logistics?: CrewMemberTemplate[];
  communication?: CrewMemberTemplate[];
  security?: CrewMemberTemplate[];
  others?: CrewMemberTemplate[];
  [crewList: string]: CrewMemberTemplate[];
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
  requirements?: {
    audio: { inputList: InputRiderTemplate[]; mixesList: MixRiderTemplate[] };
  };
  staff: { crewList: CrewTeamTemplate };
  stageSpecs: StageSpecs;
  created_at: Date;
  updated_at: Date;
}
export class ArtistRiderModel
  extends EntityModel<ArtistRiderTemplate>
  implements ArtistRiderTemplate
{
  declare artistId: string;
  declare name: string;
  declare instruments: GeneralMusicalInstrumentModel[];
  declare requirements?: {
    audio: { inputList: InputRiderTemplate[]; mixesList: MixRiderTemplate[] };
  };
  declare staff: { crewList: CrewTeamTemplate };
  declare stageSpecs: StageSpecs;
  declare created_at: Date;
  declare updated_at: Date;

  get crewMembersByRole(): { role: string; people: CrewMemberTemplate[] }[] {
    const crewMembers: { role: string; people: CrewMemberTemplate[] }[] = [];

    return crewMembers;
  }
}
