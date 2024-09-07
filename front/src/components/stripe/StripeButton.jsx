function StripeButton({...props}) {
    return <stripe-buy-button
        buy-button-id="buy_btn_1PuIIgIouOdAoNHVity7roTL"
        publishable-key="pk_test_51PuI49IouOdAoNHVlmhzd5JlD5l7IIMnFx84PGpJyv8SPnITeUHwUDeHsRRv77bdYDoLzNJEXgs1e6r8jqIruP1p00FHddWYn5"
        customer-email={props.email}
    >
    </stripe-buy-button>
}

export default StripeButton