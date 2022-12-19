import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface IQuery {
    id: number;
    body: string;
}

type QueryState = {
    [x: string]: any;
    queries: IQuery[];
}

const initialState: QueryState = {
    queries: [
        {
            id: 1,
            body: `SELECT Id, Name FROM Account LIMIT 10`
        },
        {
            id: 2,
            body: `SELECT Id, FirstName, LastName FROM Contact LIMIT 10`
        },        

    ]
}

export const querySlice = createSlice({
    name: "query",
    initialState,
    reducers: {
        addQuery: (state, action) => {
            console.log(`Payload of add query ${action.payload}`)
            console.log(`Payload body of add query - ${action.payload.body}`)
            const newQuery: IQuery = {
                id: Math.random(),
                body: action.payload.body
            }
            return {
                ...state,
                queries: state.queries.concat(newQuery)
            }
        }
    }
})

export const { addQuery } = querySlice.actions
export default querySlice.reducer
export const selectQueries = (state: RootState) => state.query.queries 