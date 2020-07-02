import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { PageQuery } from 'src/app/models/app/pageQuery';
import { CollectionViewer } from '@angular/cdk/collections';

export abstract class AbstractDataSource<T> {

    constructor(
        protected  store: Store<AppState>,
        protected subject: BehaviorSubject<T>
    ) {}

    public abstract load (queryString: string, page: PageQuery): void;
    protected abstract unsubscribe (): void;

    connect(collectionViewer: CollectionViewer): Observable<T> {
        return this.subject.asObservable();
    }

    disconnectManual(): void {
        this.unsubscribe();
        this.subject.complete();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.unsubscribe();
        this.subject.complete();
    }

    getData(): T {
        return this.subject.value;
    }
}
