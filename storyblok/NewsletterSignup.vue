<script setup>
const props = defineProps({ blok: Object })

// @todo Switch from Formeezy to Sendinblue for this, removing the redunant code

const form = reactive({
  isLoading: false,
  isSubmitted: false,
  isError: false,
  email: '',
})


async function handleSubmit(event) {
  const formData = new FormData(event.target)

  form.isLoading = true

  await useFetch('https://formeezy.com/api/v1/forms/639a787403e0a70008e4df00/submissions', {
    method: 'POST',
    body: formData
  })
    .then((response) => {
      form.isSubmitted = true
    })
    .catch((error) => {
      form.isError = true
    })
    .finally(() => {
      form.isLoading = false
    })
}
</script>

<template>
  <section v-editable="blok" :id="blok._uid">
    <StoryblokImage
      :decorative="true"
      :image="blok.image"
      height="550"
      width="425"
      sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
    />

    <div class="main">
      <h2>{{ blok.headline }}</h2>

      <p v-if="blok.copy">{{ blok.copy }}</p>

      <form
        :disabled="form.isLoading || form.isError || form.isSubmitted"
        @submit.prevent="handleSubmit"
      >
        <div v-if="form.isLoading" class="spinner">
          <span>Submitting...</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="1em" fill="currentColor"><circle class="bounce-1" cx="4" cy="12" r="3"/><circle class="bounce-1 bounce-2" cx="12" cy="12" r="3"/><circle class="bounce-1 bounce-3" cx="20" cy="12" r="3"/></svg>
        </div>

        <div v-else-if="form.isSubmitted" class="thank-you">
          Thanks for signing up!
        </div>

        <div role="alert" v-else-if="form.isError" class="error">
          There was a problem signing up. Please try again later.
        </div>

        <div class="fields">
          <div class="field">
            <label for="email" class="sr-only">Email *</label>
            <input id="email" name="email" v-model="form.email" type="email" placeholder="Email Address" required autocomplete="email" autocapitalize="off" autocorrect="off" spellcheck="false" />
          </div>

          <div class="submit">
            <button :disabled="form.isLoading" type="submit">Sign Up</button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
// @todo Create global classes for text-over-image blocks and implement here

section {
  display: grid;
  grid-template-areas: "mantel";
}

img,
.main {
  grid-area: mantel;
}

img {
  display: block;
  filter: blur(1px)
          brightness(50%)
          contrast(50%)
          grayscale(0.15);
  height: var(--newsletter-height);
  object-fit: cover;
  object-position: var(--newsletter-position);
  width: 100vw;
  z-index: -1;
}

.main {
  align-items: center;
  color: var(--color-white);
  display: flex;
  flex-flow: column;
  gap: 2rem;
  height: 100%;
  justify-content: center;
  margin: auto;
  text-align: center;
  text-shadow:
    0 1px 2px var(--color-black),
    0 0 5rem var(--color-black);
  width: 80vw;
}

form {
  position: relative;

  &[disabled="true"] {
    .fields {
      opacity: 0;
    }
  }
}

.thank-you,
.error {
  bottom: 0;
  font-size: var(--font-size-h4);
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}

.spinner {
  align-items: center;
  bottom: 0;
  display: flex;
  font-size: var(--spinner-font-size);
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;

  span {
    left: -999rem;
    padding-bottom: 1.25rem;
    position: var(--spinner-span-position);
  }

  svg {
    display: var(--spinner-svg-display);
  }
}

.bounce-1 {
  animation: bounce 1.05s infinite;
}

.bounce-2 {
  animation-delay: .1s;
}

.bounce-3 {
  animation-delay: .2s;
}

@keyframes bounce {
  0%, 57.14% {
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    transform: translate(0);
  }

  28.57% {
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    transform: translateY(-6px);
  }

  100% {
    transform: translate(0);
  }
}

.fields {
  display: flex;
  flex-flow: var(--newsletter-flex);
  gap: var(--newsletter-gap);
}

input {
  background-color: var(--color-white);
  border: 1px solid var(--color-grey-light);
  border-radius: 2px;
  padding: var(--newsletter-input-padding);
  width: 100%;
}

button {
  background-color: var(--color-grey-light);
  border: 1px solid var(--color-grey-light);
  color: var(--color-black);
  padding: 1.25rem 2rem;
  transition: var(--button-tx);

  &[disabled] {
    background-color: transparent;
    color: var(--color-grey-light);
  }
}
</style>
