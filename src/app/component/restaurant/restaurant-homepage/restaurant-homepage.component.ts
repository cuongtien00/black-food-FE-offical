import {Component, OnInit} from '@angular/core';
import {FoodService} from "../../../service/food.service";
import {Food} from "../../../model/food";
import {TokenService} from "../../../service/token.service";
import {UserService} from "../../../service/user.service";
import {User} from "../../../model/User";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FoodOrder} from "../../../model/food-order";
import {Payment} from "../../../model/Payment";
import {Restaurant} from "../../../model/restaurant";
import {RestaurantService} from "../../../service/restaurant.service";

@Component({
  selector: 'app-restaurant-homepage',
  templateUrl: './restaurant-homepage.component.html',
  styleUrls: ['./restaurant-homepage.component.css']
})
export class RestaurantHomepageComponent implements OnInit {
  userId: number = 0;
  restaurantId: number = 0;
  // @ts-ignore
  restaurant: Restaurant = {}
  // @ts-ignore
  user: User = {}
  search: string = '';
  foods: Food[] = []
  // @ts-ignore
  foodOrder: FoodOrder = {}
  foodId: number = 0;
  checkMerchant = false;

  constructor(
    private foodService: FoodService,
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private restaurantService: RestaurantService
  ) {
    this.activeRoute.params.subscribe((params: Params)=>{
      this.restaurantId = params['id'];
      this.restaurantService.findRestaurantById(this.restaurantId).subscribe(res => {
        this.restaurant = res;
      })
    });
  }

  getUserById() {

    const userId = this.tokenService.getUserId();
    this.userService.getUserById(userId).subscribe(data => {
      this.user = data;
      // console.log('user: ' + JSON.stringify(data));
      // @ts-ignore
      let roles: Role [] = this.user.roles
      console.log(`user`+JSON.stringify(this.user));
      if (this.user.restaurantId != null){
        this.checkMerchant = true;
      }
    });
  }


  ngOnInit(): void {
    this.getCurrentUserId();
    this.loadData();
    this.getFoodOrder();
    this.getUserById();
  }

  loadData() {
    this.foodService.showAllByRestaurantId(this.restaurantId).subscribe(foods => {
      this.foods = foods;
      console.log('foods: ' + this.foods);
    });
  }
  getFoodOrder() {
    this.userService.showCurrentFO().subscribe(fo => {
      this.foodOrder = fo;
      console.log('fo: ' + JSON.stringify(this.foodOrder));
    })
  }
  addShopCart(event: any) {
    // @ts-ignore
    this.foodId = event.target.id;
    console.log('foodid: ' + this.foodId);
    // @ts-ignore
    let food: Food = {
      id: this.foodId
    }
    this.userService.addFood(food).subscribe(user => {
      this.user = user;
      this.getFoodOrder();
      alert('Th??m v??o gi??? h??ng th??nh c??ng');
    });
  }
  public getTotalPrice(foods: Food[]) {
    let sum = 0;
    if (foods!= undefined){
      foods.forEach(food => {
        sum += food.price
      });
      return sum
    }
    return sum;
  }

  removeFood(event: any) {
    let index = event.target.id;
    console.log('index: ' + index);
    this.foodOrder.foodList.splice(index, 1);
    this.userService.updateFoodList(this.foodOrder.foodList).subscribe(user => {
      this.user = user;
    })
  }


  getCurrentUserId() {
    this.userId = this.tokenService.getUserId();
    console.log('userId o token: ' + this.userId);
  }

  onSearchFood() {
    this.router.navigate(['/restaurant-search-food/' + this.restaurantId], {queryParams: {search: this.search}});
  }

  toRestaurantDetail() {
    console.log('a')
    this.router.navigate(['/restaurant-detail/' + this.restaurantId], {queryParams: {userId: this.userId}});
  }
}
