import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { AccountType } from 'src/app/models/user/accountType';
import { UserActions, UserActionTypes } from '../actions/user.actions';

export interface AccountTypeState extends EntityState<AccountType> {
    loading: boolean;
    allAccountTypesLoaded: boolean;
}

export const adapter: EntityAdapter<AccountType> = createEntityAdapter<AccountType>();

export const initialAccountTypeState: AccountTypeState = adapter.getInitialState({
    loading: false,
    allAccountTypesLoaded: false
});

export function accountTypesReducer(state: AccountTypeState = initialAccountTypeState, action: UserActions): AccountTypeState {
    switch (action.type) {
        case UserActionTypes.AllAccountTypesRequested:
            return {...state, loading: true};
        case UserActionTypes.AllAccountTypesLoaded:
            return adapter.addAll(action.payload.accountTypes, {...state, allAccountTypesLoad: true, loading: false});
        case UserActionTypes.FaqAddedSuccess:
            var e = state.entities
            e[action.payload.faq.accountTypeId].faqs.push(action.payload.faq);
            return {...state, entities: e };
        case UserActionTypes.FaqDeletedSuccess:
            var e = state.entities
            console.log(action.payload.faq);
            var faqList = e[action.payload.faq.accountTypeId].faqs;
            var filtered = faqList.find(f => f.id == action.payload.faq.id);
            if (filtered) {
                var editFaqId = faqList.indexOf(filtered);
                faqList.splice(editFaqId, 1);
                e[action.payload.faq.accountTypeId].faqs = faqList;
            }

            return {...state, entities: e};
        case UserActionTypes.FaqEditedSuccess:
            var e = state.entities
            var faqList = e[action.payload.faq.accountTypeId].faqs;
            var filtered = faqList.find(f => f.id == action.payload.faq.id);
            if (filtered) {
                var editFaqId = faqList.indexOf(filtered);
                faqList.splice(editFaqId, 1);
                faqList.splice(editFaqId, 0, action.payload.faq);
                e[action.payload.faq.accountTypeId].faqs = faqList;
            }

            return {...state, entities: e};
        case UserActionTypes.AllAccountTypesLoaded:
            return adapter.addAll(action.payload.accountTypes, {...state, allAccountTypesLoaded: true, loading: false});
        default: {
            return state;
        }
    }
}

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();
