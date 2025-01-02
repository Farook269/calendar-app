import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";

// Initial Communication Methods
const DEFAULT_COMMUNICATION_METHODS = [
  {
    id: uuidv4(),
    name: "LinkedIn Post",
    description: "Post on LinkedIn",
    sequence: 1,
    isMandatory: false,
  },
  {
    id: uuidv4(),
    name: "LinkedIn Message",
    description: "Send a direct message on LinkedIn",
    sequence: 2,
    isMandatory: false,
  },
  {
    id: uuidv4(),
    name: "Email",
    description: "Send an email",
    sequence: 3,
    isMandatory: true,
  },
  {
    id: uuidv4(),
    name: "Phone Call",
    description: "Make a phone call",
    sequence: 4,
    isMandatory: false,
  },
  {
    id: uuidv4(),
    name: "Other",
    description: "Other communication method",
    sequence: 5,
    isMandatory: false,
  },
];

// Sample Companies
const SAMPLE_COMPANIES = [
  {
    id: uuidv4(),
    name: "Tech Corp",
    emails: ["info@techcorp.com"],
    phoneNumbers: ["+1234567890"],
    communicationPeriodicity: 14,
    location: ["Hyderabad"],
    lastCommunicationDate: "2023-09-25",
    lastCommunicationSequence: 1,
  },
  {
    id: uuidv4(),
    name: "Innovate Inc",
    emails: ["contact@innovateinc.com"],
    phoneNumbers: ["+0987654321"],
    communicationPeriodicity: 7,
    location: ["Mumbai"],
    lastCommunicationDate: "2023-09-20",
    lastCommunicationSequence: 2,
  },
  {
    id: uuidv4(),
    name: "Global Solutions",
    emails: ["support@globalsolutions.com"],
    phoneNumbers: ["+1122334455"],
    communicationPeriodicity: 30,
    location: ["Bengaluru"],
    lastCommunicationDate: "2023-09-15",
    lastCommunicationSequence: 3,
  },
  {
    id: uuidv4(),
    name: "Future Tech",
    emails: ["info@futuretech.com"],
    phoneNumbers: ["+4455667788"],
    communicationPeriodicity: 10,
    location: ["Chennai"],
    lastCommunicationDate: "2023-09-10",
    lastCommunicationSequence: 4,
  },
  {
    id: uuidv4(),
    name: "NextGen Solutions",
    emails: ["contact@nextgen.com"],
    phoneNumbers: ["+9988776655"],
    communicationPeriodicity: 5,
    location: ["Pune"],
    lastCommunicationDate: "2023-09-05",
    lastCommunicationSequence: 5,
  },
];

// Sample Communications
const SAMPLE_COMMUNICATIONS = [
  {
    id: uuidv4(),
    companyId: SAMPLE_COMPANIES[0].id,
    type: "LinkedIn Post",
    timestamp: "2023-09-25",
    notes: "Posted about new product launch.",
    sequence: 1,
  },
  {
    id: uuidv4(),
    companyId: SAMPLE_COMPANIES[1].id,
    type: "Email",
    timestamp: "2023-09-20",
    notes: "Sent follow-up email for partnership.",
    sequence: 2,
  },
  {
    id: uuidv4(),
    companyId: SAMPLE_COMPANIES[2].id,
    type: "Phone Call",
    timestamp: "2023-09-15",
    notes: "Discussed upcoming project details.",
    sequence: 3,
  },
  {
    id: uuidv4(),
    companyId: SAMPLE_COMPANIES[3].id,
    type: "LinkedIn Message",
    timestamp: "2023-09-10",
    notes: "Sent a LinkedIn message for collaboration.",
    sequence: 4,
  },
  {
    id: uuidv4(),
    companyId: SAMPLE_COMPANIES[4].id,
    type: "Email",
    timestamp: "2023-09-05",
    notes: "Sent an email for project updates.",
    sequence: 5,
  },
];

// Initial State
const initialState = {
  companies: SAMPLE_COMPANIES,
  communicationMethods: DEFAULT_COMMUNICATION_METHODS,
  communications: SAMPLE_COMMUNICATIONS,
};

// Action Types
const ADD_COMMUNICATION = "ADD_COMMUNICATION";
const UPDATE_COMPANY_LAST_COMMUNICATION = "UPDATE_COMPANY_LAST_COMMUNICATION";

const ADD_COMPANY = "ADD_COMPANY";
const UPDATE_COMPANY = "UPDATE_COMPANY";
const DELETE_COMPANY = "DELETE_COMPANY";
const UPDATE_COMMUNICATION_METHOD = "UPDATE_COMMUNICATION_METHOD";
const DELETE_COMMUNICATION_METHOD = "DELETE_COMMUNICATION_METHOD";
const ADD_COMMUNICATION_METHOD = "ADD_COMMUNICATION_METHOD";

// Reducer
function communicationReducer(state, action) {
  switch (action.type) {
    case ADD_COMPANY:
      return {
        ...state,
        companies: [
          ...state.companies,
          {
            ...action.payload,
            id: uuidv4(),
            createdAt: new Date(),
            lastCommunicationDate: new Date(),
            lastCommunicationSequence: 0,
          },
        ],
      };
    case UPDATE_COMPANY:
      return {
        ...state,
        companies: state.companies.map((company) =>
          company.id === action.payload.id
            ? { ...company, ...action.payload }
            : company
        ),
      };
    case DELETE_COMPANY:
      return {
        ...state,
        companies: state.companies.filter(
          (company) => company.id !== action.payload
        ),
      };
    case UPDATE_COMMUNICATION_METHOD:
      return {
        ...state,
        communicationMethods: state.communicationMethods.map((method) =>
          method.id === action.payload.id
            ? { ...method, ...action.payload }
            : method
        ),
      };
    case DELETE_COMMUNICATION_METHOD:
      return {
        ...state,
        communicationMethods: state.communicationMethods.filter(
          (method) => method.id !== action.payload
        ),
      };

    case ADD_COMMUNICATION_METHOD:
      return {
        ...state,
        communicationMethods: [
          ...state.communicationMethods,
          {
            ...action.payload,
            id: action.payload.id || uuidv4(),
          },
        ],
      };

    case ADD_COMMUNICATION:
      const sortedMethods = state.communicationMethods.sort(
        (a, b) => a.sequence - b.sequence
      );
      const currentCompany = state.companies.find(
        (c) => c.id === action.payload.companyId
      );

      const nextMethodSequence =
        currentCompany.lastCommunicationSequence === sortedMethods.length
          ? currentCompany.lastCommunicationSequence
          : currentCompany.lastCommunicationSequence + 1;

      return {
        ...state,
        communications: [
          ...state.communications,
          {
            ...action.payload,
            id: uuidv4(),
            createdAt: new Date(),
            sequence: nextMethodSequence,
          },
        ],
        companies: state.companies.map((company) =>
          company.id === action.payload.companyId
            ? {
                ...company,
                lastCommunicationDate: action.payload.timestamp,
                lastCommunicationSequence: nextMethodSequence,
              }
            : company
        ),
      };

    default:
      return state;
  }
}

// Context Creation
const CommunicationContext = createContext();

// Provider Component
export function CommunicationProvider({ children }) {
  const [state, dispatch] = useReducer(communicationReducer, initialState);

  // Action Creators
  const addCompany = useCallback((company) => {
    dispatch({
      type: ADD_COMPANY,
      payload: {
        ...company,
        emails: company.emails || [""],
        phoneNumbers: company.phoneNumbers || [""],
        communicationPeriodicity: company.communicationPeriodicity || 14,
      },
    });
  }, []);

  const addCommunication = useCallback((communicationData) => {
    dispatch({
      type: ADD_COMMUNICATION,
      payload: communicationData,
    });
  }, []);

  const getLastFiveCommunications = useCallback(
    (companyId) => {
      return state.communications
        .filter((comm) => comm.companyId === companyId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
    },
    [state.communications]
  );

  const getNextScheduledCommunication = useCallback(
    (companyId) => {
      const company = state.companies.find((c) => c.id === companyId);
      if (!company) return null;

      const sortedMethods = state.communicationMethods.sort(
        (a, b) => a.sequence - b.sequence
      );
      const currentSequence = company.lastCommunicationSequence || 1;
      const nextMethod =
        sortedMethods.find((m) => m.sequence > currentSequence) ||
        sortedMethods[sortedMethods.length - 1];

      const lastCommunication = new Date(
        company.lastCommunicationDate || new Date(0)
      );

      const nextCommunicationDate = new Date(
        lastCommunication.getTime() +
          (company.communicationPeriodicity || 14) * 24 * 60 * 60 * 1000
      );

      return {
        date: nextCommunicationDate,
        type: nextMethod.name,
        sequence: nextMethod.sequence,
      };
    },
    [state.companies, state.communicationMethods]
  );

  const getOverdueCommunications = useCallback(() => {
    const today = new Date();
    return state.companies.filter((company) => {
      if (!company.lastCommunicationDate) return true;
      const daysSinceLastCom =
        (today.getTime() - new Date(company.lastCommunicationDate).getTime()) /
        (1000 * 60 * 60 * 24);
      return daysSinceLastCom > (company.communicationPeriodicity || 14);
    });
  }, [state.companies]);

  const getDueTodayCommunications = useCallback(() => {
    const today = new Date();
    return state.companies.filter((company) => {
      if (!company.lastCommunicationDate) return false;
      const daysSinceLastCom =
        (today.getTime() - new Date(company.lastCommunicationDate).getTime()) /
        (1000 * 60 * 60 * 24);
      return daysSinceLastCom === (company.communicationPeriodicity || 14);
    });
  }, [state.companies]);

  const getAllCommunicationsForCompany = useCallback(
    (companyId) => {
      return state.communications
        .filter((comm) => comm.companyId === companyId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
    [state.communications]
  );

  const updateCompany = useCallback((company) => {
    dispatch({ type: UPDATE_COMPANY, payload: company });
  }, []);

  const deleteCompany = useCallback((companyId) => {
    dispatch({ type: DELETE_COMPANY, payload: companyId });
  }, []);

  const addCommunicationMethod = useCallback(
    (method) => {
      dispatch({
        type: ADD_COMMUNICATION_METHOD,
        payload: {
          ...method,
          id: method.id || `method_${Date.now()}`,
          sequence: method.sequence || state.communicationMethods.length + 1,
        },
      });
    },
    [state.communicationMethods]
  );

  // Communication Method Actions
  const updateCommunicationMethod = useCallback((method) => {
    dispatch({ type: UPDATE_COMMUNICATION_METHOD, payload: method });
  }, []);

  const deleteCommunicationMethod = useCallback((methodId) => {
    dispatch({ type: DELETE_COMMUNICATION_METHOD, payload: methodId });
  }, []);

  // Helper Functions
  const getCompanyById = useCallback(
    (id) => {
      return state.companies.find((company) => company.id === id);
    },
    [state.companies]
  );

  return (
    <CommunicationContext.Provider
      value={{
        state,
        addCommunication,
        getLastFiveCommunications,
        getNextScheduledCommunication,
        getAllCommunicationsForCompany,
        addCompany,
        updateCompany,
        deleteCompany,
        addCommunicationMethod,
        updateCommunicationMethod,
        deleteCommunicationMethod,
        getCompanyById,
        getOverdueCommunications,
        getDueTodayCommunications,
      }}
    >
      {children}
    </CommunicationContext.Provider>
  );
}

// Custom Hook
export function useCommunication() {
  const context = useContext(CommunicationContext);
  if (!context) {
    throw new Error(
      "useCommunication must be used within a CommunicationProvider"
    );
  }
  return context;
}