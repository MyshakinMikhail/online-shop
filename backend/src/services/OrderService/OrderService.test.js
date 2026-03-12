import { describe, expect, it } from "vitest";
import { OrderService } from "./OrderService";

describe("OrderService testing calculateOrderTotal", () => {
	it("correct prices of products", () => {
		const totalPrice = OrderService.calculateOrderTotal([
			{
				product: { price: 100 },
				quantity: 2,
			},
			{
				product: { price: 200 },
				quantity: 3,
			},
		]);
		expect(totalPrice).toBe(800);
	});
});

describe("OrderService testing activatePromocode", () => {
	it("correct promocode", () => {
		const { isPromocodeActivate, sale } = OrderService.activatePromocode("SALE10");
		expect(isPromocodeActivate).toBe(true);
		expect(sale).toBe(10);
	});
	it("uncorrect promocode", () => {
		const { isPromocodeActivate, sale } = OrderService.activatePromocode("sdfli;gh;sdkjn");
		expect(isPromocodeActivate).toBe(false);
		expect(sale).toBe(0);
	});
});

describe("OrderService testing getPriceWithPromocode", () => {
	it("get price with active promocode", () => {
		const { finalPrice } = OrderService.getPriceWithPromocode(100, "SALE10");
		expect(finalPrice).toBe(90);
	});
	it("get price with not active promocode", () => {
		const { finalPrice: finalPriceFalse } = OrderService.getPriceWithPromocode(100, "");
		expect(finalPriceFalse).toBe(100);
	});
});
