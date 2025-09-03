export interface Appointment {
  id: string;
  createdTime: string;
  fields: {
    appointment_id: number;
    appointment_date: string;
    appointment_address: string;
    contact_id: string[];
    contact_name: string[];
    contact_surname: string[];
    contact_email: string[];
    contact_phone: number[];
    agent_id: string[];
    agent_name: string[];
    agent_surname: string[];
    is_cancelled : boolean;
    status? : string;
  };
}


export interface Agent {
  id: string;
  createdTime: string;
  fields: {
    number: number;
    agent_name: string;
    agent_surname: string;
    appointments: string[];
    color: string;
  };
}