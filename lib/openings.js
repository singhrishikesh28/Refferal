export const OPENINGS = [
  { id: 'QE01', title: 'Quality Engineer', roleType: 'Contract', location: 'Bangalore' },
  { id: 'DEV-BE01', title: 'Software Development Engineer Backend', roleType: 'Full-Time', location: 'Bangalore' },
  { id: 'QE03', title: 'Quality Engineer', roleType: 'Contract', location: 'Mumbai' },
  { id: 'SDE-L01', title: 'Software Development Engineer - Lateral', roleType: 'Full-Time', location: 'Bangalore' },
  { id: 'DEV-BE02', title: 'Software Development Engineer Backend', roleType: 'Intern', location: 'Bangalore' },
  { id: 'DEV-FE04', title: 'Software Development Engineer Frontend', roleType: 'Full-Time', location: 'Bangalore' },
  { id: 'DEV-BE04', title: 'Software Development Engineer Backend', roleType: 'Intern', location: 'Mumbai' },
  { id: 'SDE-A01', title: 'Software Development Engineer - AI', roleType: 'Full-Time', location: 'Bangalore' },
  { id: 'DEV-BE03', title: 'Software Development Engineer Backend', roleType: 'Full-Time', location: 'Mumbai' },
  { id: 'DS01', title: 'Data Scientist', roleType: 'Full-Time', location: 'Mumbai' },
];

const openingsById = new Map(OPENINGS.map((opening) => [opening.id, opening]));

export function getOpeningById(id) {
  return openingsById.get(id);
}
