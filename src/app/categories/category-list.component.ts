import { Component, OnInit } from "@angular/core";

import { CategoryService } from "~/app/categories/shared/category.service";
import { Category } from "~/app/categories/shared/cetegory.model";

import { ObservableArray } from "tns-core-modules/data/observable-array";
import { UtilService } from "../shared/utils.service";

@Component({
  selector: "Category",
  moduleId: module.id,
  templateUrl: "./category-list.component.html",
  styleUrls: ["././category-list.component.scss"]
})
export class CategoryListComponent implements OnInit {
  private _isLoading: boolean = false;
  private _categories: ObservableArray<Category> = new ObservableArray<Category>([]);

  constructor(
    private _categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this._isLoading = true;

    this._categoryService.load()
    .then((categories: Array<Category>) => {
      this._categories = new ObservableArray(categories);
      this._categories.forEach((category) => {
        category.colorClass = UtilService.generateRandomTileColor();
      });
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
