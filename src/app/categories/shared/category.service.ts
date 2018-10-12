import { Injectable } from "@angular/core";
import { Category } from "~/app/categories/shared/cetegory.model";
import { Kinvey } from "kinvey-nativescript-sdk";
import { UtilService } from "~/app/shared/utils.service";

@Injectable()
export class CategoryService {
  private allCategories: Array<Category> = [];
  private categoryStore = Kinvey.DataStore.collection('category', Kinvey.DataStoreType.Cache);

  getCategoryById(id: string): Category {
    if (!id) {
      return;
    }

    return this.allCategories.filter((category) => {
      return category.id === id;
    })[0];
  }

  load(): Promise<any> {
    return UtilService.isUserLoggedIn()
    .then(() => {
      const sortByDescription = new Kinvey.Query();
      sortByDescription.ascending("description");
      const stream = this.categoryStore.find(sortByDescription);

      return stream.toPromise();
    }).then((data) => {
      this.allCategories = [];
      data.forEach((categoryData: any) => {
        categoryData.id = categoryData._id;
        const category = new Category(categoryData);

        this.allCategories.push(category);
      });

      return this.allCategories;
    });
  }
}