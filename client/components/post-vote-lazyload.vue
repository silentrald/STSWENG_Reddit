<template>
  <div :class="`vote-${direction}`">
    <div class="upvote empty" />
    <div class="score empty" />
    <div class="downvote empty" />
  </div>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: 'row'
    }
  }
}
</script>

<style scoped>
.vote-col {
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-right: 16px;
  min-width: 64px;
}

.vote-row {
  display: flex;

  justify-content: flex-end;
  background-color: #ffffff1a; /* 10% opacity */
  padding: 0.5rem;
  border-radius: 10px;
}

.upvote, .downvote {
  cursor: pointer;
  margin: 0 auto;
}

.empty {
  background-color: #FFFFFF;
  border-radius: 6px;
  width: 24px;
  height: 24px;
  margin: 2px;
}

.score {
  text-align: center;
}

/* TODO: Change design here */
.upvoted {
  background-color: green;
}

/* TODO: Chage design here */
.downvoted {
  background-color: red;
}
</style>
