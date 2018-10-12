import { OnInit, Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { CategoryService } from "~/app/categories/shared/category.service";
import { Category } from "~/app/categories/shared/cetegory.model";
import { ObservableArray } from "tns-core-modules/data/observable-array";

@Component({
  selector: 'Category',
  moduleId: module.id,
  templateUrl: "./category-list.component.html"
})
export class CategoryListComponent implements OnInit {
  private _isLoading: boolean = false;
  private _categories: ObservableArray<Category> = new ObservableArray<Category>([]);

  constructor(
    private _categoryService: CategoryService,
    private _routerExtensions: RouterExtensions
  ) { }

  ngOnInit(): void {
    this._isLoading = true;

    this._categoryService.load()
    .then((categories: Array<Category>) => {
      this._categories = new ObservableArray(categories);
      this._isLoading = false;
    })
    .catch(() => {
      this._isLoading = false;
    });
  }

  get categories(): ObservableArray<Category> {
    return this._categories;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }
}
