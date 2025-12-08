// src/services/meetingPoints.ts
// Service to find optimal meeting points (bus stops, T-junctions, landmarks)

import { COLORS } from '@/constants';
import { getMeetingPointsAPI } from '@/api/locations';

export interface MeetingPoint {
  id: string;
  name: string;
  type: 'bus_stop' | 't_junction' | 'landmark' | 'intersection';
  latitude: number;
  longitude: number;
  address?: string;
  distanceFromUser?: number; // meters
  distanceFromRoute?: number; // meters
  walkingTime?: number; // minutes
  isOnRoute?: boolean; // Whether this point is along the route to destination
}

/**
 * Fetch meeting points from backend API
 * Falls back to local data if API is unavailable
 */
export async function getMeetingPointsFromAPI(
  userLat: number,
  userLng: number,
  destLat: number,
  destLng: number
): Promise<MeetingPoint[]> {
  try {
    const points = await getMeetingPointsAPI(userLat, userLng, destLat, destLng);
    if (points && points.length > 0) {
      return points.map(p => ({
        ...p,
        distanceFromUser: p.distanceFromUser,
        walkingTime: p.walkingTime,
        isOnRoute: p.isOnRoute,
      }));
    }
  } catch (error) {
    console.log('Backend API unavailable, using local meeting points');
  }
  
  // Fallback to local search
  return findSmartMeetingPoints(userLat, userLng, destLat, destLng, 3000, 2000);
}

// Comprehensive Lagos meeting points database
// In production, this would be fetched from OpenStreetMap API or backend
const LAGOS_MEETING_POINTS: MeetingPoint[] = [
  // ============================================
  // MAINLAND - BUS STOPS
  // ============================================
  
  // Yaba Area
  { id: 'bs001', name: 'Sabo Bus Stop', type: 'bus_stop', latitude: 6.5200, longitude: 3.3800, address: 'Sabo, Yaba' },
  { id: 'bs002', name: 'Yaba Bus Stop', type: 'bus_stop', latitude: 6.5095, longitude: 3.3711, address: 'Yaba, Lagos' },
  { id: 'bs003', name: 'Jibowu Bus Stop', type: 'bus_stop', latitude: 6.5280, longitude: 3.3730, address: 'Jibowu, Yaba' },
  { id: 'bs004', name: 'Tejuosho Bus Stop', type: 'bus_stop', latitude: 6.5120, longitude: 3.3680, address: 'Tejuosho, Yaba' },
  { id: 'bs005', name: 'Oyingbo Bus Stop', type: 'bus_stop', latitude: 6.4920, longitude: 3.3870, address: 'Oyingbo, Lagos' },
  { id: 'bs006', name: 'Adekunle Bus Stop', type: 'bus_stop', latitude: 6.4780, longitude: 3.3920, address: 'Adekunle, Yaba' },
  { id: 'bs007', name: 'Unilag Gate Bus Stop', type: 'bus_stop', latitude: 6.5180, longitude: 3.3950, address: 'University of Lagos' },
  { id: 'bs008', name: 'Akoka Bus Stop', type: 'bus_stop', latitude: 6.5250, longitude: 3.3880, address: 'Akoka, Yaba' },
  
  // Surulere Area
  { id: 'bs009', name: 'Ojuelegba Bus Stop', type: 'bus_stop', latitude: 6.5158, longitude: 3.3624, address: 'Ojuelegba, Lagos' },
  { id: 'bs010', name: 'Stadium Bus Stop', type: 'bus_stop', latitude: 6.4969, longitude: 3.3590, address: 'National Stadium, Surulere' },
  { id: 'bs011', name: 'Aguda Bus Stop', type: 'bus_stop', latitude: 6.5050, longitude: 3.3530, address: 'Aguda, Surulere' },
  { id: 'bs012', name: 'Bode Thomas Bus Stop', type: 'bus_stop', latitude: 6.4980, longitude: 3.3620, address: 'Bode Thomas, Surulere' },
  { id: 'bs013', name: 'Shitta Bus Stop', type: 'bus_stop', latitude: 6.5010, longitude: 3.3560, address: 'Shitta, Surulere' },
  { id: 'bs014', name: 'Lawanson Bus Stop', type: 'bus_stop', latitude: 6.5130, longitude: 3.3500, address: 'Lawanson, Surulere' },
  { id: 'bs015', name: 'Itire Bus Stop', type: 'bus_stop', latitude: 6.5080, longitude: 3.3450, address: 'Itire, Surulere' },
  { id: 'bs016', name: 'Ijeshatedo Bus Stop', type: 'bus_stop', latitude: 6.4950, longitude: 3.3480, address: 'Ijeshatedo, Surulere' },
  
  // Ikeja Area
  { id: 'bs017', name: 'Ikeja Bus Stop', type: 'bus_stop', latitude: 6.6018, longitude: 3.3515, address: 'Ikeja, Lagos' },
  { id: 'bs018', name: 'Alausa Bus Stop', type: 'bus_stop', latitude: 6.6150, longitude: 3.3580, address: 'Alausa, Ikeja' },
  { id: 'bs019', name: 'Allen Avenue Bus Stop', type: 'bus_stop', latitude: 6.6050, longitude: 3.3488, address: 'Allen Avenue, Ikeja' },
  { id: 'bs020', name: 'Opebi Bus Stop', type: 'bus_stop', latitude: 6.5906, longitude: 3.3589, address: 'Opebi, Ikeja' },
  { id: 'bs021', name: 'Toyin Street Bus Stop', type: 'bus_stop', latitude: 6.5980, longitude: 3.3550, address: 'Toyin Street, Ikeja' },
  { id: 'bs022', name: 'Awolowo Way Bus Stop', type: 'bus_stop', latitude: 6.5920, longitude: 3.3430, address: 'Awolowo Way, Ikeja' },
  { id: 'bs023', name: 'MMA Bus Stop', type: 'bus_stop', latitude: 6.5774, longitude: 3.3212, address: 'Airport Road, Ikeja' },
  { id: 'bs024', name: 'Agidingbi Bus Stop', type: 'bus_stop', latitude: 6.6080, longitude: 3.3470, address: 'Agidingbi, Ikeja' },
  { id: 'bs025', name: 'Computer Village Bus Stop', type: 'bus_stop', latitude: 6.5986, longitude: 3.3492, address: 'Computer Village, Ikeja' },
  
  // Maryland/Anthony Area
  { id: 'bs026', name: 'Maryland Bus Stop', type: 'bus_stop', latitude: 6.5703, longitude: 3.3636, address: 'Maryland, Lagos' },
  { id: 'bs027', name: 'Anthony Bus Stop', type: 'bus_stop', latitude: 6.5598, longitude: 3.3717, address: 'Anthony Village, Lagos' },
  { id: 'bs028', name: 'Gbagada Bus Stop', type: 'bus_stop', latitude: 6.5530, longitude: 3.3850, address: 'Gbagada, Lagos' },
  { id: 'bs029', name: 'Pedro Bus Stop', type: 'bus_stop', latitude: 6.5460, longitude: 3.3780, address: 'Pedro, Gbagada' },
  { id: 'bs030', name: 'Oworonsoki Bus Stop', type: 'bus_stop', latitude: 6.5311, longitude: 3.3892, address: 'Oworonshoki, Lagos' },
  
  // Oshodi/Isolo Area
  { id: 'bs031', name: 'Oshodi Bus Stop', type: 'bus_stop', latitude: 6.5568, longitude: 3.3429, address: 'Oshodi, Lagos' },
  { id: 'bs032', name: 'Isolo Bus Stop', type: 'bus_stop', latitude: 6.5380, longitude: 3.3280, address: 'Isolo, Lagos' },
  { id: 'bs033', name: 'Ejigbo Bus Stop', type: 'bus_stop', latitude: 6.5250, longitude: 3.3150, address: 'Ejigbo, Lagos' },
  { id: 'bs034', name: 'Jakande Bus Stop', type: 'bus_stop', latitude: 6.5150, longitude: 3.3080, address: 'Jakande Estate, Isolo' },
  { id: 'bs035', name: 'Mushin Bus Stop', type: 'bus_stop', latitude: 6.5380, longitude: 3.3550, address: 'Mushin, Lagos' },
  { id: 'bs036', name: 'Idi-Araba Bus Stop', type: 'bus_stop', latitude: 6.5150, longitude: 3.3550, address: 'Idi-Araba, Mushin' },
  
  // Ikorodu Road Axis
  { id: 'bs037', name: 'Fadeyi Bus Stop', type: 'bus_stop', latitude: 6.5252, longitude: 3.3695, address: 'Fadeyi, Lagos' },
  { id: 'bs038', name: 'Onipanu Bus Stop', type: 'bus_stop', latitude: 6.5350, longitude: 3.3650, address: 'Onipanu, Lagos' },
  { id: 'bs039', name: 'Palmgrove Bus Stop', type: 'bus_stop', latitude: 6.5355, longitude: 3.3684, address: 'Palmgrove, Lagos' },
  { id: 'bs040', name: 'Bariga Bus Stop', type: 'bus_stop', latitude: 6.5420, longitude: 3.3920, address: 'Bariga, Lagos' },
  { id: 'bs041', name: 'Somolu Bus Stop', type: 'bus_stop', latitude: 6.5380, longitude: 3.3720, address: 'Somolu, Lagos' },
  { id: 'bs042', name: 'Ketu Bus Stop', type: 'bus_stop', latitude: 6.5850, longitude: 3.3780, address: 'Ketu, Lagos' },
  { id: 'bs043', name: 'Mile 12 Bus Stop', type: 'bus_stop', latitude: 6.6050, longitude: 3.3920, address: 'Mile 12, Lagos' },
  { id: 'bs044', name: 'Ojota Bus Stop', type: 'bus_stop', latitude: 6.5780, longitude: 3.3850, address: 'Ojota, Lagos' },
  
  // Apapa/Costain Area
  { id: 'bs045', name: 'Costain Bus Stop', type: 'bus_stop', latitude: 6.4828, longitude: 3.3678, address: 'Costain, Lagos' },
  { id: 'bs046', name: 'Ijora Bus Stop', type: 'bus_stop', latitude: 6.4650, longitude: 3.3720, address: 'Ijora, Lagos' },
  { id: 'bs047', name: 'Apapa Bus Stop', type: 'bus_stop', latitude: 6.4480, longitude: 3.3650, address: 'Apapa, Lagos' },
  { id: 'bs048', name: 'Ebute Metta Bus Stop', type: 'bus_stop', latitude: 6.4850, longitude: 3.3850, address: 'Ebute Metta, Lagos' },
  
  // Festac/Mile 2 Area
  { id: 'bs049', name: 'Mile 2 Bus Stop', type: 'bus_stop', latitude: 6.4657, longitude: 3.3075, address: 'Mile 2, Lagos' },
  { id: 'bs050', name: 'Festac Bus Stop', type: 'bus_stop', latitude: 6.4680, longitude: 3.2850, address: 'Festac Town, Lagos' },
  { id: 'bs051', name: 'Satellite Town Bus Stop', type: 'bus_stop', latitude: 6.4580, longitude: 3.2680, address: 'Satellite Town, Lagos' },
  { id: 'bs052', name: 'Amuwo Odofin Bus Stop', type: 'bus_stop', latitude: 6.4550, longitude: 3.3180, address: 'Amuwo Odofin, Lagos' },
  
  // Ogba/Berger Area
  { id: 'bs053', name: 'Berger Bus Stop', type: 'bus_stop', latitude: 6.6158, longitude: 3.3360, address: 'Berger, Lagos' },
  { id: 'bs054', name: 'Ogba Bus Stop', type: 'bus_stop', latitude: 6.6250, longitude: 3.3420, address: 'Ogba, Lagos' },
  { id: 'bs055', name: 'Oregun Bus Stop', type: 'bus_stop', latitude: 6.6120, longitude: 3.3650, address: 'Oregun, Lagos' },
  { id: 'bs056', name: 'Omole Bus Stop', type: 'bus_stop', latitude: 6.6350, longitude: 3.3580, address: 'Omole Phase 1, Lagos' },
  { id: 'bs057', name: 'Magodo Bus Stop', type: 'bus_stop', latitude: 6.6280, longitude: 3.3820, address: 'Magodo, Lagos' },
  
  // ============================================
  // ISLAND - BUS STOPS
  // ============================================
  
  // Lagos Island
  { id: 'bs058', name: 'CMS Bus Stop', type: 'bus_stop', latitude: 6.4541, longitude: 3.4065, address: 'Marina, Lagos Island' },
  { id: 'bs059', name: 'Obalende Bus Stop', type: 'bus_stop', latitude: 6.4452, longitude: 3.4168, address: 'Obalende, Lagos' },
  { id: 'bs060', name: 'Tafawa Balewa Bus Stop', type: 'bus_stop', latitude: 6.4520, longitude: 3.4020, address: 'TBS, Lagos Island' },
  { id: 'bs061', name: 'Idumota Bus Stop', type: 'bus_stop', latitude: 6.4580, longitude: 3.3950, address: 'Idumota, Lagos Island' },
  { id: 'bs062', name: 'Balogun Bus Stop', type: 'bus_stop', latitude: 6.4550, longitude: 3.3920, address: 'Balogun Market, Lagos Island' },
  
  // Ikoyi
  { id: 'bs063', name: 'Ikoyi Bus Stop', type: 'bus_stop', latitude: 6.4500, longitude: 3.4350, address: 'Ikoyi, Lagos' },
  { id: 'bs064', name: 'Falomo Bus Stop', type: 'bus_stop', latitude: 6.4380, longitude: 3.4220, address: 'Falomo, Ikoyi' },
  { id: 'bs065', name: 'Osborne Bus Stop', type: 'bus_stop', latitude: 6.4620, longitude: 3.4280, address: 'Osborne, Ikoyi' },
  { id: 'bs066', name: 'Awolowo Road Bus Stop', type: 'bus_stop', latitude: 6.4450, longitude: 3.4180, address: 'Awolowo Road, Ikoyi' },
  
  // Victoria Island
  { id: 'bs067', name: 'Victoria Island Bus Stop', type: 'bus_stop', latitude: 6.4281, longitude: 3.4219, address: 'Victoria Island, Lagos' },
  { id: 'bs068', name: 'Bar Beach Bus Stop', type: 'bus_stop', latitude: 6.4220, longitude: 3.4150, address: 'Bar Beach, VI' },
  { id: 'bs069', name: 'Adeola Odeku Bus Stop', type: 'bus_stop', latitude: 6.4310, longitude: 3.4280, address: 'Adeola Odeku, VI' },
  { id: 'bs070', name: 'Ahmadu Bello Bus Stop', type: 'bus_stop', latitude: 6.4350, longitude: 3.4320, address: 'Ahmadu Bello Way, VI' },
  { id: 'bs071', name: 'Sanusi Fafunwa Bus Stop', type: 'bus_stop', latitude: 6.4280, longitude: 3.4250, address: 'Sanusi Fafunwa, VI' },
  
  // Lekki Phase 1
  { id: 'bs072', name: 'Lekki Phase 1 Bus Stop', type: 'bus_stop', latitude: 6.4378, longitude: 3.4721, address: 'Lekki Phase 1, Lagos' },
  { id: 'bs073', name: 'Admiralty Bus Stop', type: 'bus_stop', latitude: 6.4340, longitude: 3.4545, address: 'Admiralty Way, Lekki' },
  { id: 'bs074', name: 'Marwa Bus Stop', type: 'bus_stop', latitude: 6.4420, longitude: 3.4580, address: 'Marwa, Lekki' },
  { id: 'bs075', name: 'Jakande Roundabout Bus Stop', type: 'bus_stop', latitude: 6.4450, longitude: 3.4850, address: 'Jakande, Lekki' },
  { id: 'bs076', name: 'Chevron Bus Stop', type: 'bus_stop', latitude: 6.4380, longitude: 3.5150, address: 'Chevron, Lekki' },
  
  // Lekki-Ajah Axis
  { id: 'bs077', name: 'VGC Bus Stop', type: 'bus_stop', latitude: 6.4520, longitude: 3.5380, address: 'VGC, Lekki' },
  { id: 'bs078', name: 'Ajah Bus Stop', type: 'bus_stop', latitude: 6.4667, longitude: 3.5750, address: 'Ajah, Lagos' },
  { id: 'bs079', name: 'Abraham Adesanya Bus Stop', type: 'bus_stop', latitude: 6.4580, longitude: 3.5520, address: 'Abraham Adesanya, Ajah' },
  { id: 'bs080', name: 'Sangotedo Bus Stop', type: 'bus_stop', latitude: 6.4720, longitude: 3.5880, address: 'Sangotedo, Ajah' },
  { id: 'bs081', name: 'Ogombo Bus Stop', type: 'bus_stop', latitude: 6.4650, longitude: 3.5650, address: 'Ogombo, Ajah' },
  
  // ============================================
  // T-JUNCTIONS / MAJOR INTERSECTIONS
  // ============================================
  
  // Mainland Junctions
  { id: 'tj001', name: 'Allen Junction', type: 't_junction', latitude: 6.6050, longitude: 3.3488, address: 'Allen Avenue, Ikeja' },
  { id: 'tj002', name: 'Opebi Junction', type: 't_junction', latitude: 6.5906, longitude: 3.3589, address: 'Opebi, Ikeja' },
  { id: 'tj003', name: 'Anthony Junction', type: 't_junction', latitude: 6.5598, longitude: 3.3717, address: 'Anthony Village' },
  { id: 'tj004', name: 'Oworonshoki Junction', type: 't_junction', latitude: 6.5311, longitude: 3.3892, address: 'Oworonshoki' },
  { id: 'tj005', name: 'Berger Junction', type: 't_junction', latitude: 6.6158, longitude: 3.3360, address: 'Ogba, Lagos' },
  { id: 'tj006', name: 'Fadeyi Junction', type: 't_junction', latitude: 6.5252, longitude: 3.3695, address: 'Fadeyi, Lagos' },
  { id: 'tj007', name: 'Palmgrove Junction', type: 't_junction', latitude: 6.5355, longitude: 3.3684, address: 'Palmgrove, Lagos' },
  { id: 'tj008', name: 'Costain Junction', type: 't_junction', latitude: 6.4828, longitude: 3.3678, address: 'Costain, Lagos' },
  { id: 'tj009', name: 'Yaba Junction', type: 't_junction', latitude: 6.5120, longitude: 3.3750, address: 'Yaba, Lagos' },
  { id: 'tj010', name: 'Ojuelegba Junction', type: 't_junction', latitude: 6.5158, longitude: 3.3624, address: 'Ojuelegba, Lagos' },
  { id: 'tj011', name: 'Oshodi Interchange', type: 't_junction', latitude: 6.5580, longitude: 3.3450, address: 'Oshodi, Lagos' },
  { id: 'tj012', name: 'Maryland Junction', type: 't_junction', latitude: 6.5700, longitude: 3.3640, address: 'Maryland, Lagos' },
  { id: 'tj013', name: 'Ketu Junction', type: 't_junction', latitude: 6.5850, longitude: 3.3750, address: 'Ketu, Lagos' },
  { id: 'tj014', name: 'Ojota Junction', type: 't_junction', latitude: 6.5780, longitude: 3.3850, address: 'Ojota, Lagos' },
  { id: 'tj015', name: 'Gbagada Junction', type: 't_junction', latitude: 6.5530, longitude: 3.3850, address: 'Gbagada, Lagos' },
  { id: 'tj016', name: 'Mushin Junction', type: 't_junction', latitude: 6.5380, longitude: 3.3550, address: 'Mushin, Lagos' },
  { id: 'tj017', name: 'Mile 2 Junction', type: 't_junction', latitude: 6.4657, longitude: 3.3075, address: 'Mile 2, Lagos' },
  { id: 'tj018', name: 'Festac Junction', type: 't_junction', latitude: 6.4680, longitude: 3.2850, address: 'Festac Town' },
  { id: 'tj019', name: 'Agege Motor Road Junction', type: 't_junction', latitude: 6.5650, longitude: 3.3380, address: 'Agege Motor Road' },
  { id: 'tj020', name: 'Western Avenue Junction', type: 't_junction', latitude: 6.4950, longitude: 3.3580, address: 'Western Avenue, Surulere' },
  
  // Island Junctions
  { id: 'tj021', name: 'Falomo Junction', type: 't_junction', latitude: 6.4380, longitude: 3.4220, address: 'Falomo, Ikoyi' },
  { id: 'tj022', name: 'Law School Junction', type: 't_junction', latitude: 6.4320, longitude: 3.4180, address: 'Victoria Island' },
  { id: 'tj023', name: 'Ozumba Mbadiwe Junction', type: 't_junction', latitude: 6.4420, longitude: 3.4350, address: 'Victoria Island' },
  { id: 'tj024', name: 'Lekki Roundabout', type: 't_junction', latitude: 6.4450, longitude: 3.4750, address: 'Lekki Phase 1' },
  { id: 'tj025', name: 'Chevron Junction', type: 't_junction', latitude: 6.4380, longitude: 3.5150, address: 'Chevron, Lekki' },
  { id: 'tj026', name: 'Jakande Junction', type: 't_junction', latitude: 6.4450, longitude: 3.4850, address: 'Jakande, Lekki' },
  { id: 'tj027', name: 'Admiralty Junction', type: 't_junction', latitude: 6.4340, longitude: 3.4545, address: 'Admiralty Way' },
  { id: 'tj028', name: 'Ajah Roundabout', type: 't_junction', latitude: 6.4667, longitude: 3.5750, address: 'Ajah, Lagos' },
  { id: 'tj029', name: 'VGC Junction', type: 't_junction', latitude: 6.4520, longitude: 3.5380, address: 'VGC, Lekki' },
  { id: 'tj030', name: 'CMS Junction', type: 't_junction', latitude: 6.4541, longitude: 3.4065, address: 'CMS, Lagos Island' },
  
  // ============================================
  // LANDMARKS
  // ============================================
  
  // Shopping Malls
  { id: 'lm001', name: 'Shoprite Ikeja', type: 'landmark', latitude: 6.5957, longitude: 3.3387, address: 'Ikeja City Mall' },
  { id: 'lm002', name: 'Palms Shopping Mall', type: 'landmark', latitude: 6.4295, longitude: 3.4279, address: 'Lekki, Lagos' },
  { id: 'lm003', name: 'Maryland Mall', type: 'landmark', latitude: 6.5690, longitude: 3.3620, address: 'Maryland, Lagos' },
  { id: 'lm004', name: 'Adeniran Ogunsanya Mall', type: 'landmark', latitude: 6.4970, longitude: 3.3580, address: 'Surulere, Lagos' },
  { id: 'lm005', name: 'Shoprite Ajah', type: 'landmark', latitude: 6.4650, longitude: 3.5720, address: 'Ajah, Lagos' },
  { id: 'lm006', name: 'Circle Mall', type: 'landmark', latitude: 6.4450, longitude: 3.4920, address: 'Jakande, Lekki' },
  { id: 'lm007', name: 'Novare Lekki Mall', type: 'landmark', latitude: 6.4620, longitude: 3.5480, address: 'Sangotedo, Ajah' },
  { id: 'lm008', name: 'Ikeja GRA Shopping Centre', type: 'landmark', latitude: 6.5850, longitude: 3.3450, address: 'GRA Ikeja' },
  
  // Markets & Commercial Areas
  { id: 'lm009', name: 'Computer Village Gate', type: 'landmark', latitude: 6.5986, longitude: 3.3492, address: 'Computer Village, Ikeja' },
  { id: 'lm010', name: 'Alaba International Market', type: 'landmark', latitude: 6.4620, longitude: 3.2450, address: 'Alaba, Lagos' },
  { id: 'lm011', name: 'Trade Fair Complex', type: 'landmark', latitude: 6.4550, longitude: 3.2580, address: 'Trade Fair, Lagos' },
  { id: 'lm012', name: 'Tejuosho Market', type: 'landmark', latitude: 6.5120, longitude: 3.3680, address: 'Yaba, Lagos' },
  { id: 'lm013', name: 'Balogun Market Gate', type: 'landmark', latitude: 6.4550, longitude: 3.3920, address: 'Lagos Island' },
  
  // Hotels & Entertainment
  { id: 'lm014', name: 'Eko Hotel Roundabout', type: 'landmark', latitude: 6.4265, longitude: 3.4195, address: 'Victoria Island' },
  { id: 'lm015', name: 'Silverbird Galleria', type: 'landmark', latitude: 6.4310, longitude: 3.4250, address: 'Victoria Island' },
  { id: 'lm016', name: 'Federal Palace Hotel', type: 'landmark', latitude: 6.4270, longitude: 3.4180, address: 'Victoria Island' },
  { id: 'lm017', name: 'Sheraton Hotel', type: 'landmark', latitude: 6.5850, longitude: 3.3480, address: 'Ikeja, Lagos' },
  { id: 'lm018', name: 'The Wheatbaker Hotel', type: 'landmark', latitude: 6.4450, longitude: 3.4380, address: 'Ikoyi, Lagos' },
  
  // Stadiums & Parks
  { id: 'lm019', name: 'National Stadium Gate', type: 'landmark', latitude: 6.4997, longitude: 3.3671, address: 'Surulere, Lagos' },
  { id: 'lm020', name: 'Teslim Balogun Stadium', type: 'landmark', latitude: 6.4980, longitude: 3.3620, address: 'Surulere, Lagos' },
  { id: 'lm021', name: 'Onikan Stadium', type: 'landmark', latitude: 6.4480, longitude: 3.4050, address: 'Lagos Island' },
  
  // Transport Hubs
  { id: 'lm022', name: 'Murtala Muhammed Airport', type: 'landmark', latitude: 6.5774, longitude: 3.3212, address: 'Ikeja, Lagos' },
  { id: 'lm023', name: 'Oshodi Transport Interchange', type: 'landmark', latitude: 6.5580, longitude: 3.3450, address: 'Oshodi, Lagos' },
  
  // Toll Gates & Bridges
  { id: 'lm024', name: 'Lekki Toll Gate', type: 'landmark', latitude: 6.4340, longitude: 3.4545, address: 'Admiralty Way, Lekki' },
  { id: 'lm025', name: 'Ikoyi Bridge Toll Gate', type: 'landmark', latitude: 6.4538, longitude: 3.4289, address: 'Lekki-Ikoyi Link Bridge' },
  { id: 'lm026', name: 'Third Mainland Bridge (Oworonshoki)', type: 'landmark', latitude: 6.5311, longitude: 3.3892, address: 'Oworonshoki' },
  { id: 'lm027', name: 'Third Mainland Bridge (Adeniji)', type: 'landmark', latitude: 6.4580, longitude: 3.3950, address: 'Adeniji Adele' },
  
  // Universities & Schools
  { id: 'lm028', name: 'University of Lagos Main Gate', type: 'landmark', latitude: 6.5180, longitude: 3.3950, address: 'Akoka, Yaba' },
  { id: 'lm029', name: 'Yaba Tech Main Gate', type: 'landmark', latitude: 6.5158, longitude: 3.3775, address: 'Yaba, Lagos' },
  { id: 'lm030', name: 'LASU Main Gate', type: 'landmark', latitude: 6.4680, longitude: 3.2050, address: 'Ojo, Lagos' },
  
  // Government Buildings
  { id: 'lm031', name: 'Alausa Secretariat', type: 'landmark', latitude: 6.6150, longitude: 3.3580, address: 'Alausa, Ikeja' },
  { id: 'lm032', name: 'Lagos State House', type: 'landmark', latitude: 6.4550, longitude: 3.4280, address: 'Marina, Lagos Island' },
  
  // Churches & Mosques
  { id: 'lm033', name: 'Redemption Camp', type: 'landmark', latitude: 6.8020, longitude: 3.5280, address: 'Lagos-Ibadan Expressway' },
  { id: 'lm034', name: 'Lagos Central Mosque', type: 'landmark', latitude: 6.4580, longitude: 3.3880, address: 'Lagos Island' },
];

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculate walking time in minutes (average walking speed: 5 km/h)
 */
export function calculateWalkingTime(distanceMeters: number): number {
  const walkingSpeedMps = 5000 / 3600; // 5 km/h in m/s
  const timeSeconds = distanceMeters / walkingSpeedMps;
  return Math.round(timeSeconds / 60);
}

/**
 * Calculate the perpendicular distance from a point to a line segment
 * Used to determine if a meeting point is "on the route"
 */
function pointToLineDistance(
  pointLat: number,
  pointLon: number,
  lineLat1: number,
  lineLon1: number,
  lineLat2: number,
  lineLon2: number
): number {
  const A = pointLat - lineLat1;
  const B = pointLon - lineLon1;
  const C = lineLat2 - lineLat1;
  const D = lineLon2 - lineLon1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  
  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let closestLat, closestLon;

  if (param < 0) {
    closestLat = lineLat1;
    closestLon = lineLon1;
  } else if (param > 1) {
    closestLat = lineLat2;
    closestLon = lineLon2;
  } else {
    closestLat = lineLat1 + param * C;
    closestLon = lineLon1 + param * D;
  }

  return calculateDistance(pointLat, pointLon, closestLat, closestLon);
}

/**
 * Check if a point is roughly along the route from user to destination
 * A point is considered "on route" if it's within a corridor between user and destination
 */
function isPointOnRoute(
  pointLat: number,
  pointLon: number,
  userLat: number,
  userLon: number,
  destLat: number,
  destLon: number,
  corridorWidthMeters: number = 500 // How far from the direct line is acceptable
): boolean {
  // Distance from point to the line between user and destination
  const distToLine = pointToLineDistance(pointLat, pointLon, userLat, userLon, destLat, destLon);
  
  // Point must be within the corridor
  if (distToLine > corridorWidthMeters) return false;
  
  // Point must be between user and destination (not behind or beyond)
  const userToPoint = calculateDistance(userLat, userLon, pointLat, pointLon);
  const pointToDest = calculateDistance(pointLat, pointLon, destLat, destLon);
  const userToDest = calculateDistance(userLat, userLon, destLat, destLon);
  
  // Allow some tolerance (point can be slightly beyond destination)
  return (userToPoint + pointToDest) <= (userToDest * 1.3);
}

/**
 * Find meeting points near a user's location
 */
export function findNearbyMeetingPoints(
  userLat: number,
  userLon: number,
  maxDistanceMeters: number = 2000, // 2km radius
  limit: number = 10
): MeetingPoint[] {
  const pointsWithDistance = LAGOS_MEETING_POINTS.map(point => ({
    ...point,
    distanceFromUser: calculateDistance(userLat, userLon, point.latitude, point.longitude),
    walkingTime: calculateWalkingTime(
      calculateDistance(userLat, userLon, point.latitude, point.longitude)
    ),
  }));

  return pointsWithDistance
    .filter(p => p.distanceFromUser <= maxDistanceMeters)
    .sort((a, b) => a.distanceFromUser - b.distanceFromUser)
    .slice(0, limit);
}

/**
 * Find smart meeting points that are:
 * 1. Close to the rider (within walking distance)
 * 2. Along the route to the destination (so driver doesn't deviate much)
 * 3. Prioritize bus stops and junctions (easier to find)
 */
export function findSmartMeetingPoints(
  userLat: number,
  userLon: number,
  destLat: number,
  destLon: number,
  maxWalkingMeters: number = 2000, // Max 2km walk for rider
  routeCorridorMeters: number = 1000 // How far from direct route is acceptable
): MeetingPoint[] {
  console.log('Finding smart meeting points from', userLat, userLon, 'to', destLat, destLon);
  
  const pointsWithScores = LAGOS_MEETING_POINTS.map(point => {
    const distanceFromUser = calculateDistance(userLat, userLon, point.latitude, point.longitude);
    const walkingTime = calculateWalkingTime(distanceFromUser);
    const onRoute = isPointOnRoute(
      point.latitude, point.longitude,
      userLat, userLon,
      destLat, destLon,
      routeCorridorMeters
    );
    
    // Score calculation (lower is better):
    // - Walking distance is most important
    // - Being on route gives a bonus (reduces score)
    // - Bus stops get slight priority over other types
    let score = distanceFromUser;
    
    if (onRoute) {
      score *= 0.5; // 50% bonus for being on route
    }
    
    if (point.type === 'bus_stop') {
      score *= 0.9; // 10% bonus for bus stops
    } else if (point.type === 't_junction') {
      score *= 0.95; // 5% bonus for junctions
    }
    
    return {
      ...point,
      distanceFromUser,
      walkingTime,
      isOnRoute: onRoute,
      score,
    };
  });

  // Filter by walking distance and sort by score
  const filtered = pointsWithScores
    .filter(p => p.distanceFromUser <= maxWalkingMeters)
    .sort((a, b) => a.score - b.score);
  
  console.log('Filtered points within', maxWalkingMeters, 'm:', filtered.length);
  
  // If we have on-route points, prioritize them
  const onRoutePoints = filtered.filter(p => p.isOnRoute);
  const nearbyPoints = filtered.filter(p => !p.isOnRoute);
  
  console.log('On-route points:', onRoutePoints.length, 'Nearby points:', nearbyPoints.length);
  
  // Return on-route points first, then nearby ones, up to 6 total
  return [...onRoutePoints, ...nearbyPoints].slice(0, 6);
}

/**
 * Find optimal meeting points along driver's route
 * Returns points that are close to both user and driver's route
 */
export function findOptimalMeetingPoints(
  userLat: number,
  userLon: number,
  driverRouteLat: number,
  driverRouteLon: number,
  destinationLat: number,
  destinationLon: number,
  maxWalkingDistanceMeters: number = 1000 // Max 1km walking for user
): MeetingPoint[] {
  // Calculate midpoint of driver's route for approximation
  const routeMidLat = (driverRouteLat + destinationLat) / 2;
  const routeMidLon = (driverRouteLon + destinationLon) / 2;

  const pointsWithScores = LAGOS_MEETING_POINTS.map(point => {
    const distanceFromUser = calculateDistance(userLat, userLon, point.latitude, point.longitude);
    const distanceFromRoute = calculateDistance(routeMidLat, routeMidLon, point.latitude, point.longitude);
    
    // Score: lower is better (prioritize short walk for user + close to route)
    const score = distanceFromUser * 1.5 + distanceFromRoute * 0.5;
    
    return {
      ...point,
      distanceFromUser,
      distanceFromRoute,
      walkingTime: calculateWalkingTime(distanceFromUser),
      score,
    };
  });

  return pointsWithScores
    .filter(p => p.distanceFromUser <= maxWalkingDistanceMeters)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);
}

/**
 * Find points between two locations (for rider-driver meetup)
 */
export function findMeetingPointsBetween(
  userLat: number,
  userLon: number,
  driverLat: number,
  driverLon: number,
  maxUserWalkMeters: number = 800
): MeetingPoint[] {
  // Midpoint between user and driver
  const midLat = (userLat + driverLat) / 2;
  const midLon = (userLon + driverLon) / 2;
  
  const totalDistance = calculateDistance(userLat, userLon, driverLat, driverLon);

  const pointsWithScores = LAGOS_MEETING_POINTS.map(point => {
    const distanceFromUser = calculateDistance(userLat, userLon, point.latitude, point.longitude);
    const distanceFromDriver = calculateDistance(driverLat, driverLon, point.latitude, point.longitude);
    const distanceFromMid = calculateDistance(midLat, midLon, point.latitude, point.longitude);
    
    // Fair score: point should be reasonably close to both parties
    // But user walks, driver drives - so user distance weighted more
    const fairnessScore = Math.abs(distanceFromUser - distanceFromDriver * 0.2);
    
    return {
      ...point,
      distanceFromUser,
      distanceFromRoute: distanceFromDriver,
      walkingTime: calculateWalkingTime(distanceFromUser),
      score: fairnessScore + distanceFromMid,
    };
  });

  return pointsWithScores
    .filter(p => p.distanceFromUser <= maxUserWalkMeters)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);
}

/**
 * Get icon name for meeting point type
 */
export function getMeetingPointIcon(type: MeetingPoint['type']): string {
  switch (type) {
    case 'bus_stop':
      return 'bus-outline';
    case 't_junction':
      return 'git-branch-outline';
    case 'landmark':
      return 'location-outline';
    case 'intersection':
      return 'git-merge-outline';
    default:
      return 'location-outline';
  }
}

/**
 * Get color for meeting point type
 */
export function getMeetingPointColor(type: MeetingPoint['type']): string {
  switch (type) {
    case 'bus_stop':
      return '#3B82F6'; // Blue
    case 't_junction':
      return '#10B981'; // Green
    case 'landmark':
      return '#8B5CF6'; // Purple
    case 'intersection':
      return '#F59E0B'; // Amber
    default:
      return COLORS.primary;
  }
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export default {
  findNearbyMeetingPoints,
  findSmartMeetingPoints,
  findOptimalMeetingPoints,
  findMeetingPointsBetween,
  calculateDistance,
  calculateWalkingTime,
  formatDistance,
  getMeetingPointIcon,
  getMeetingPointColor,
};
