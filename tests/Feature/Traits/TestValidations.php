<?php

namespace Tests\Feature\Traits;

use Illuminate\Foundation\Testing\TestResponse;

trait TestValidations
{
    abstract protected function routeStore(): string;

    abstract protected function routeUpdate(): string;

    protected function assertInvalidationInStoreAction(array $data, string $rule, array $ruleParams = [])
    {
        $response = $this->postJson($this->routeStore(), $data);
        $fields = array_keys($data);
        $this->assertInvalidationFields($response, $fields, $rule, $ruleParams);
    }

    protected function assertInvalidationInUpdateAction(array $data, string $rule, array $ruleParams = [])
    {
        $response = $this->putJson($this->routeUpdate(), $data);
        $fields = array_keys($data);
        $this->assertInvalidationFields($response, $fields, $rule, $ruleParams);
    }

    protected function assertInvalidationFields(
        TestResponse $response,
        array $fields,
        string $rule,
        array $ruleParams = []
    ) {
        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors($fields);

        foreach ($fields as $field) {
            $fieldName = str_replace('_', ' ', $field);

            $response->assertJsonFragment([
                \Lang::get("validation.{$rule}", ['attribute' => $fieldName] + $ruleParams),
            ]);
        }
    }
}
